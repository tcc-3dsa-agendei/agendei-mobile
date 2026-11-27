import { z } from "zod";
import { configuredUrl } from "@/services/company";

const slotSchema = z.object({
  startAt: z.iso.datetime(),
  endAt: z.iso.datetime(),
});
const responseSchema = z.object({ slots: z.array(slotSchema) });
const uuidV7 = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
const requestSchema = z.object({ companyId: uuidV7, serviceId: uuidV7, date: z.iso.date() });
const errorSchema = z.object({ message: z.string() });

export type Slot = z.infer<typeof slotSchema>;

export async function getAvailability(companyId: string, serviceId: string, date: string, signal: AbortSignal): Promise<Slot[]> {
  const validated = requestSchema.safeParse({ companyId, serviceId, date });
  if (!validated.success) throw new Error("Dados inválidos para consultar horários.");
  const api = configuredUrl(process.env.EXPO_PUBLIC_API_URL);
  const query = `serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`;
  let response: Response;
  try {
    response = await fetch(`${api.origin}/public/companies/${companyId}/availability?${query}`, { signal });
  } catch (error: unknown) {
    if (signal.aborted) throw error;
    throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
  }
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("A resposta do servidor é inválida. Tente novamente.");
  }
  if (!response.ok) {
    const body = errorSchema.safeParse(payload);
    if (response.status === 404 && body.success && body.data.message === "Serviço não encontrado") {
      throw new Error("Serviço não encontrado. Volte e escolha outro serviço.");
    }
    if (response.status === 404 && body.success && body.data.message === "Empresa não encontrada") {
      throw new Error("Empresa não encontrada. Volte e confira o link informado.");
    }
    throw new Error("Não foi possível consultar os horários. Tente novamente.");
  }
  const result = responseSchema.safeParse(payload);
  if (!result.success) throw new Error("A resposta do servidor é inválida. Tente novamente.");
  return result.data.slots;
}
