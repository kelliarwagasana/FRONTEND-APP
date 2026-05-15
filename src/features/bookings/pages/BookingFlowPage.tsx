import { type ChangeEvent, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Navbar from '../../../shared/components/Navbar'
import Spinner from '../../../shared/components/Spinner'
import { getCurrentUser } from '../../auth/authStorage'
import { useListing } from '../../listings/hooks/useListing'
import {
  bookingStep1Schema,
  bookingStep2Schema,
  bookingStep3Schema,
  validatePhotoFile,
  type BookingStep1Values,
  type BookingStep2Values,
  type BookingStep3Values,
} from '../schemas/bookingWizardSchemas'
import { useCreateBooking } from '../hooks/useCreateBooking'

function nightsBetween(checkIn: string, checkOut: string) {
  const a = new Date(checkIn).getTime()
  const b = new Date(checkOut).getTime()
  return Math.max(0, Math.ceil((b - a) / (1000 * 60 * 60 * 24)))
}

export default function BookingFlowPage() {
  const { listingId } = useParams<{ listingId: string }>()
  const navigate = useNavigate()
  const listingQuery = useListing(listingId)
  const listing = listingQuery.data
  const currentUser = getCurrentUser()
  const createBooking = useCreateBooking()

  const [step, setStep] = useState(1)
  const [step1, setStep1] = useState<BookingStep1Values | null>(null)
  const [step2, setStep2] = useState<BookingStep2Values | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined)
  const [photoError, setPhotoError] = useState('')
  const [step3, setStep3] = useState<BookingStep3Values | null>(null)
  const [submitError, setSubmitError] = useState('')

  const form1 = useForm<BookingStep1Values>({
    resolver: zodResolver(bookingStep1Schema),
    defaultValues: { checkIn: '', checkOut: '', guests: 2 },
  })

  const form2 = useForm<BookingStep2Values>({
    resolver: zodResolver(bookingStep2Schema),
    defaultValues: { name: '', email: '', phone: '' },
  })

  const form3 = useForm<BookingStep3Values>({
    resolver: zodResolver(bookingStep3Schema),
    defaultValues: { card: '', expiry: '', cvv: '' },
  })

  const totalPrice = useMemo(() => {
    if (!listing || !step1) return 0
    const n = nightsBetween(step1.checkIn, step1.checkOut)
    return n * listing.pricePerNight
  }, [listing, step1])

  const onStep1Submit = (values: BookingStep1Values) => {
    setStep1(values)
    setStep(2)
    if (currentUser) {
      form2.reset({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
      })
    }
  }

  const onStep2Submit = (values: BookingStep2Values) => {
    setPhotoError('')
    setStep2(values)
    setStep(3)
  }

  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setPhotoError('')
    setPhotoPreview(null)
    setPhotoDataUrl(undefined)
    if (!file) return
    const err = validatePhotoFile(file)
    if (err) {
      setPhotoError(err)
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPhotoPreview(result)
      setPhotoDataUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const onStep3Submit = (values: BookingStep3Values) => {
    setStep3(values)
    setStep(4)
  }

  const handleConfirm = () => {
    if (!listing || !step1 || !step2 || !step3 || !listingId) return
    setSubmitError('')
    createBooking.mutate(
      {
        listingId,
        checkIn: step1.checkIn,
        checkOut: step1.checkOut,
        guests: step1.guests,
        guestName: step2.name,
        guestEmail: step2.email,
        guestPhone: step2.phone,
        guestPhotoDataUrl: photoDataUrl,
        payment: { card: step3.card, expiry: step3.expiry, cvv: step3.cvv },
      },
      {
        onSuccess: () => {
          toast.success('Booking confirmed')
          navigate('/bookings')
        },
        onError: (error: Error & { message?: string }) => {
          const msg = error?.message ?? 'Booking failed'
          setSubmitError(msg)
          toast.error(msg)
        },
      },
    )
  }

  if (!currentUser || currentUser.role !== 'GUEST') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="solid" />
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <p className="text-lg font-semibold text-slate-900">Guest login required to book.</p>
          <Link to="/login" className="mt-6 inline-flex rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white">
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (listingQuery.isPending || !listingId) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="solid" />
        <div className="flex min-h-[50vh] items-center justify-center gap-3">
          <Spinner />
          <span className="text-sm text-slate-600">Loading listing…</span>
        </div>
      </div>
    )
  }

  if (listingQuery.isError || !listing) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="solid" />
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <p className="text-lg font-semibold text-slate-900">Listing could not be loaded.</p>
          <Link to="/listings" className="mt-6 inline-block text-[#f97316] font-semibold">
            Back to listings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="solid" />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f97316]">Book stay</p>
            <h1 className="mt-1 text-2xl font-black text-slate-900">{listing.title}</h1>
          </div>
          <span className="border-2 border-black bg-white px-3 py-1 text-xs font-black text-black">
            Step {step} / 4
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {step === 1 && (
            <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Dates & guests</h2>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Check-in</span>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  {...form1.register('checkIn')}
                />
                {form1.formState.errors.checkIn && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{form1.formState.errors.checkIn.message}</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Check-out</span>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  {...form1.register('checkOut')}
                />
                {form1.formState.errors.checkOut && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{form1.formState.errors.checkOut.message}</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Guests</span>
                <input
                  type="number"
                  min={1}
                  max={16}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  {...form1.register('guests', { valueAsNumber: true })}
                />
                {form1.formState.errors.guests && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{form1.formState.errors.guests.message}</p>
                )}
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-[#f97316] py-3 text-sm font-semibold text-white hover:bg-black"
              >
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Guest information</h2>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Full name</span>
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...form2.register('name')} />
                {form2.formState.errors.name && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{form2.formState.errors.name.message}</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  {...form2.register('email')}
                />
                {form2.formState.errors.email && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{form2.formState.errors.email.message}</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Phone</span>
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...form2.register('phone')} />
                {form2.formState.errors.phone && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{form2.formState.errors.phone.message}</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Profile photo (optional)</span>
                <input type="file" accept="image/*" className="mt-1 text-sm" onChange={onPhotoChange} />
                {photoError && <p className="mt-1 text-xs font-semibold text-red-600">{photoError}</p>}
              </label>
              {photoPreview && (
                <img src={photoPreview} alt="" className="h-32 w-32 rounded-lg border border-slate-200 object-cover" />
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-full border border-slate-300 py-3 text-sm font-semibold">
                  Back
                </button>
                <button type="submit" className="flex-1 rounded-full bg-[#f97316] py-3 text-sm font-semibold text-white hover:bg-black">
                  Continue
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Payment (demo)</h2>
              <p className="text-xs text-slate-500">Card details are validated locally only; no charge is processed.</p>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Card number</span>
                <input
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="16 digits"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  {...form3.register('card')}
                />
                {form3.formState.errors.card && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{form3.formState.errors.card.message}</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Expiry</span>
                <input
                  placeholder="MM/YY"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  {...form3.register('expiry')}
                />
                {form3.formState.errors.expiry && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{form3.formState.errors.expiry.message}</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">CVV</span>
                <input
                  inputMode="numeric"
                  placeholder="3 digits"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  {...form3.register('cvv')}
                />
                {form3.formState.errors.cvv && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{form3.formState.errors.cvv.message}</p>
                )}
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-full border border-slate-300 py-3 text-sm font-semibold">
                  Back
                </button>
                <button type="submit" className="flex-1 rounded-full bg-[#f97316] py-3 text-sm font-semibold text-white hover:bg-black">
                  Review
                </button>
              </div>
            </form>
          )}

          {step === 4 && step1 && step2 && step3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Confirm booking</h2>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <p>
                  <span className="font-semibold text-slate-700">Property</span>
                  <br />
                  {listing.title} — {listing.location}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Dates</span>
                  <br />
                  {step1.checkIn} → {step1.checkOut} ({nightsBetween(step1.checkIn, step1.checkOut)} nights)
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Guests</span>
                  <br />
                  {step1.guests}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Guest</span>
                  <br />
                  {step2.name} · {step2.email}
                </p>
                <p className="text-lg font-black text-slate-900">
                  Total <span className="text-[#f97316]">${totalPrice.toLocaleString()}</span>
                </p>
              </div>
              {submitError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{submitError}</p>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(3)} className="flex-1 rounded-full border border-slate-300 py-3 text-sm font-semibold">
                  Back
                </button>
                <button
                  type="button"
                  disabled={createBooking.isPending}
                  onClick={handleConfirm}
                  className="flex-1 rounded-full bg-[#f97316] py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
                >
                  {createBooking.isPending ? 'Submitting…' : 'Confirm booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
