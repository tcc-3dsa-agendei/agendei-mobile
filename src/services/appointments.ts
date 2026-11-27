import { z } from "zod";
import { configuredUrl } from "@/services/company";
import { personalInfoSchema } from "@/services/personal-info";

const minuteInstantSchema = z.iso.datetime({ offset: true }).refine(
  (value) => /T\d{2}:\d{2}(?::00(?:\.0+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value),
  "O horário deve ter precisão de minutos.",
);

export const selectedSlotSchema = z.object({
  companyId: z.uuidv7(),
  serviceId: z.uuidv7(),
  date: z.iso.date(),
  startAt: minuteInstantSchema,
  endAt: z.iso.datetime({ offset: true }),
}).refine((slot) => Date.parse(slot.endAt) > Date.parse(slot.startAt));

export const appointmentPayloadSchema = z.strictObject({
  serviceId: z.uuidv7(),
  customerName: personalInfoSchema.shape.name,
  customerEmail: personalInfoSchema.shape.email,
  customerPhone: personalInfoSchema.shape.phone,
  startAt: minuteInstantSchema,
  notes: z.string().trim().max(2000).nullish(),
});

const appointmentSchema = z.object({
  id: z.uuidv7(),
  serviceId: z.uuidv7(),
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
  status: z.literal("scheduled"),
}).refine((appointment) => Date.parse(appointment.endAt) > Date.parse(appointment.startAt));

export type Appointment = z.infer<typeof appointmentSchema>;
export type AppointmentPayload = z.input<typeof appointmentPayloadSchema>;
export type AppointmentRecovery = "company" | "services" | "availability" | "personal-info" | "retry" | "uncertain";

export class AppointmentError extends Error {
  constructor(message: string, public readonly recovery: AppointmentRecovery) {
    super(message);
    this.name = "AppointmentError";
  }
}

export const uncertainAppointmentMessage = "Não foi possível confirmar se a reserva foi criada. Confira com a empresa antes de tentar novamente. Uma nova tentativa pode gerar outra reserva.";

function responseError(status: number, payload: unknown): AppointmentError {
  const parsed = z.object({ message: z.string() }).safeParse(payload);
  const message = parsed.success ? parsed.data.message : "";
  if (status === 404 && message === "Empresa não encontrada") {
    return new AppointmentError("Empresa não encontrada. Confira o link informado.", "company");
  }
  if (status === 404 && message === "Serviço não encontrado") {
    return new AppointmentError("O serviço não está mais disponível. Atualize os serviços para continuar.", "services");
  }
  if (status === 409 && message === "Já existe um agendamento neste horário") {
    return new AppointmentError("Este horário ficou ocupado. Escolha outro horário disponível.", "availability");
  }
  if (status === 422) {
    if (message === "Dados inválidos") {
      return new AppointmentError("Os dados foram rejeitados pelo servidor. Revise seus dados antes de tentar novamente.", "personal-info");
    }
    if (message === "O horário final deve ser posterior ao horário inicial") {
      return new AppointmentError("Os dados do serviço precisam ser atualizados. Escolha o serviço novamente.", "services");
    }
    if ([
      "A data do agendamento não pode estar no passado",
      "O agendamento não pode terminar no dia seguinte",
      "Não há agenda cadastrada para este dia",
      "O agendamento está fora do horário de funcionamento",
    ].includes(message)) {
      return new AppointmentError(`${message}. Escolha outro horário disponível.`, "availability");
    }
  }
  return new AppointmentError("Não foi possível criar a reserva. Tente novamente mais tarde.", "retry");
}

export async function createAppointment(companyId: string, input: AppointmentPayload): Promise<Appointment> {
  const id = z.uuidv7().safeParse(companyId);
  const payload = appointmentPayloadSchema.safeParse(input);
  if (!id.success || !payload.success) {
    throw new AppointmentError("Revise os dados do agendamento antes de finalizar.", "personal-info");
  }
  const api = configuredUrl(process.env.EXPO_PUBLIC_API_URL);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(`${api.origin}/public/companies/${id.data}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify(payload.data),
      signal: controller.signal,
    });
    const body: unknown = await response.json().catch(() => null);
    if (response.status === 201) {
      const result = z.object({ appointment: appointmentSchema }).safeParse(body);
      if (!result.success || result.data.appointment.serviceId !== payload.data.serviceId ||
          Date.parse(result.data.appointment.startAt) !== Date.parse(payload.data.startAt)) {
        throw new AppointmentError(uncertainAppointmentMessage, "uncertain");
      }
      return result.data.appointment;
    }
    if (response.ok) throw new AppointmentError(uncertainAppointmentMessage, "uncertain");
    throw responseError(response.status, body);
  } catch (error: unknown) {
    if (error instanceof AppointmentError) throw error;
    throw new AppointmentError(uncertainAppointmentMessage, "uncertain");
  } finally {
    clearTimeout(timeout);
  }
}
