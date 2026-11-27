import React, { createContext, useContext, useState } from "react";
import type { Company } from "@/services/company";
import type { PersonalInfo } from "@/services/personal-info";
import type { Appointment } from "@/services/appointments";

type BookingCompany = { id: string; company: Company };
export type SelectedSlot = { companyId: string; serviceId: string; date: string; startAt: string; endAt: string };
type CustomerDraft = { companyId: string; fields: PersonalInfo };
type AppointmentState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "uncertain" }
  | { status: "created"; companyId: string; companyName: string; serviceName: string; timeZone: string; appointment: Appointment };
type BookingCompanyContext = {
  bookingCompany: BookingCompany | null;
  setBookingCompany: React.Dispatch<React.SetStateAction<BookingCompany | null>>;
  selectedSlot: SelectedSlot | null;
  setSelectedSlot: React.Dispatch<React.SetStateAction<SelectedSlot | null>>;
  customerDraft: CustomerDraft | null;
  setCustomerDraft: React.Dispatch<React.SetStateAction<CustomerDraft | null>>;
  appointmentState: AppointmentState;
  setAppointmentState: React.Dispatch<React.SetStateAction<AppointmentState>>;
};

const Context = createContext<BookingCompanyContext | null>(null);

export function BookingCompanyProvider({ children }: { children: React.ReactNode }) {
  const [bookingCompany, setBookingCompany] = useState<BookingCompany | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [customerDraft, setCustomerDraft] = useState<CustomerDraft | null>(null);
  const [appointmentState, setAppointmentState] = useState<AppointmentState>({ status: "idle" });
  return <Context.Provider value={{ bookingCompany, setBookingCompany, selectedSlot, setSelectedSlot, customerDraft, setCustomerDraft, appointmentState, setAppointmentState }}>{children}</Context.Provider>;
}

export function useBookingCompany(): BookingCompanyContext {
  const context = useContext(Context);
  if (!context) throw new Error("BookingCompanyProvider ausente");
  return context;
}
