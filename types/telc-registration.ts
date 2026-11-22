// State of the 3-step TELC registration flow (app/telc/[lang]/register/page.tsx)
export interface RegistrationFormData {
  firstName: string; lastName: string; phoneNumber: string
  email: string; passportNumber: string; agreeTerms: boolean
  emailVerified: boolean; region: string; levelId: string
  levelName: string; examId: number | null; selectedDate: string
  selectedTime: string; examAmount: string; paymentMethod: string
  registeredAt: string; examAddress: string
  // Extended personal info
  dateOfBirth: string; gender: string; nationality: string
  countryOfBirth: string; cityOfBirth: string; currentAddress: string
  documentType: string; examType: string
}
