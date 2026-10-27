import { z } from "zod";

export const uuidV7 = z.uuidv7();
const companySchema = z.object({
  name: z.string(),
  timeZone: z.string().refine((value) => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: value });
      return true;
    } catch {
      return false;
    }
  }),
  schedules: z.array(z.object({
    weekDay: z.number().int().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
  })),
  services: z.array(z.object({
    id: uuidV7,
    name: z.string(),
    description: z.string().nullable(),
    durationInMinutes: z.number().int().min(5).max(1440),
    price: z.number().nullable(),
  })),
});

export type Company = z.infer<typeof companySchema>;

export function configuredUrl(value: string | undefined): URL {
  const parsed = z.string().url().safeParse(value);
  if (!parsed.success) throw new Error("A configuração do aplicativo está incompleta. Tente novamente mais tarde.");
  const url = new URL(parsed.data);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("A configuração do aplicativo está incompleta. Tente novamente mais tarde.");
  }
  return url;
}

export function companyIdFromLink(link: string): string {
  const input = z.string().trim().url().safeParse(link);
  if (!input.success) throw new Error("Informe um link de agenda válido.");

  const frontend = configuredUrl(process.env.EXPO_PUBLIC_FRONTEND_URL);
  const url = new URL(input.data);
  const match = /^\/agendar\/([^/]+)\/?$/.exec(url.pathname);
  const id = uuidV7.safeParse(match?.[1]);
  if (url.origin !== frontend.origin || url.username || url.password || url.search || url.hash || !id.success) {
    throw new Error("Informe um link de agenda válido.");
  }
  return id.data;
}

export async function getCompany(companyId: string, signal?: AbortSignal): Promise<Company> {
  if (!uuidV7.safeParse(companyId).success) throw new Error("Informe um link de agenda válido.");
  const api = configuredUrl(process.env.EXPO_PUBLIC_API_URL);
  let response: Response;
  try {
    response = await fetch(`${api.origin}/public/companies/${companyId}`, { signal });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
  }
  if (response.status === 404) throw new Error("Empresa não encontrada. Confira o link informado.");
  if (!response.ok) throw new Error("Não foi possível consultar a empresa. Tente novamente.");
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("A resposta do servidor é inválida. Tente novamente.");
  }
  const parsed = z.object({ company: companySchema }).safeParse(payload);
  if (!parsed.success) throw new Error("A resposta do servidor é inválida. Tente novamente.");
  return parsed.data.company;
}
