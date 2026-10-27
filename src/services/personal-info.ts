import { isValidPhone, parsePhone } from "@brazilian-utils/brazilian-utils";
import { z } from "zod";

export const personalInfoSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome.").max(150, "O nome deve ter até 150 caracteres."),
  email: z.string().trim().pipe(z.email("Informe um e-mail válido.").max(254, "O e-mail deve ter até 254 caracteres.")),
  phone: z.string()
    .refine((value) => isValidPhone(value, { version: 2 }), "Informe um telefone brasileiro válido com DDD.")
    .transform((value) => parsePhone(value)),
});

export type PersonalInfo = z.input<typeof personalInfoSchema>;
export type ValidPersonalInfo = z.output<typeof personalInfoSchema>;
export type PersonalInfoErrors = Partial<Record<keyof PersonalInfo, string>>;
export const emptyPersonalInfo: PersonalInfo = { name: "", email: "", phone: "" };
