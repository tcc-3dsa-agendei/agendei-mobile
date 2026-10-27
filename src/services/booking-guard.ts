import { z } from "zod";
import { selectedSlotSchema } from "@/services/appointments";
import { dateInTimeZone } from "@/services/booking-date";
import { personalInfoSchema } from "@/services/personal-info";
import type { Company } from "@/services/company";
import type { SelectedSlot } from "@/contexts/booking-company";
import type { PersonalInfo } from "@/services/personal-info";

type CompanyState = { id: string; company: Company } | null;
type CustomerState = { companyId: string; fields: PersonalInfo } | null;
export type BookingStep = "link" | "services" | "datetime" | "personal-info" | "ready";

export function firstIncompleteStep(company: CompanyState, serviceId: unknown, selectedSlot: SelectedSlot | null, customer: CustomerState): BookingStep {
  if (!company || !z.uuidv7().safeParse(company.id).success) return "link";
  const id = z.uuidv7().safeParse(serviceId);
  if (!id.success || !company.company.services.some((service) => service.id === id.data)) return "services";
  const slot = selectedSlotSchema.safeParse(selectedSlot);
  if (!slot.success || slot.data.companyId !== company.id || slot.data.serviceId !== id.data ||
      dateInTimeZone(new Date(slot.data.startAt), company.company.timeZone) !== slot.data.date) return "datetime";
  if (!customer || customer.companyId !== company.id || !personalInfoSchema.safeParse(customer.fields).success) return "personal-info";
  return "ready";
}
