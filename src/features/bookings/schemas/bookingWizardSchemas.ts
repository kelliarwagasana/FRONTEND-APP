import { z } from 'zod'

export const bookingStep1Schema = z
  .object({
    checkIn: z.string().min(1, 'Check-in is required'),
    checkOut: z.string().min(1, 'Check-out is required'),
    guests: z.number().min(1, 'At least 1 guest').max(16, 'Maximum 16 guests'),
  })
  .refine((data) => new Date(data.checkOut).getTime() > new Date(data.checkIn).getTime(), {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  })

export type BookingStep1Values = z.infer<typeof bookingStep1Schema>

const maxPhotoBytes = 5 * 1024 * 1024

export const bookingStep2Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Phone must be at least 7 characters'),
})

export type BookingStep2Values = z.infer<typeof bookingStep2Schema>

export const bookingStep3Schema = z.object({
  card: z
    .string()
    .regex(/^\d{16}$/, 'Card number must be exactly 16 digits'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
  cvv: z.string().regex(/^\d{3}$/, 'CVV must be exactly 3 digits'),
})

export type BookingStep3Values = z.infer<typeof bookingStep3Schema>

export function validatePhotoFile(file: File | undefined): string | null {
  if (!file) return null
  if (file.size > maxPhotoBytes) {
    return 'Photo must be under 5MB'
  }
  return null
}
