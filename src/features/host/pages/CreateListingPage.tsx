import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'
import ListingPhotoUpload, { type ListingPhotoItem } from '../components/ListingPhotoUpload'
import { useCreateListing } from '../hooks'

const schema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title is required')
      .min(10, 'Title must be at least 10 characters'),
    description: z
      .string()
      .trim()
      .min(1, 'Description is required')
      .min(50, 'Description must be at least 50 characters'),
    location: z.string().trim().min(1, 'Location is required'),
    pricePerNight: z.coerce
      .number({ message: 'Price per night is required' })
      .refine((n) => !Number.isNaN(n), { message: 'Price per night is required' })
      .min(10, 'Minimum price is $10'),
    category: z.string().trim().min(1, 'Category is required'),
    type: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'CABIN']),
    guest: z.coerce
      .number({ message: 'Number of guests is required' })
      .refine((n) => !Number.isNaN(n), { message: 'Number of guests is required' })
      .min(1, 'At least 1 guest')
      .max(16, 'Maximum 16 guests'),
    superhost: z.boolean(),
    isAvailable: z.boolean(),
    availableFrom: z.string().min(1, 'Available from date is required'),
    amenities: z.string().trim().min(1, 'Amenities are required'),
  })
  .superRefine((data, ctx) => {
    const amenityList = data.amenities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (amenityList.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Add at least one amenity (comma-separated)',
        path: ['amenities'],
      })
    }
  })

type FormValues = z.infer<typeof schema>

const inputClass =
  'mt-1.5 w-full rounded-xl border border-[#eadfdb] bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/15'
const labelClass = 'block text-sm font-semibold text-black'
const requiredMark = <span className="text-[#f97316]"> *</span>

export default function CreateListingPage() {
  const navigate = useNavigate()
  const createListing = useCreateListing()
  const [photos, setPhotos] = useState<ListingPhotoItem[]>([])
  const [photoError, setPhotoError] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      pricePerNight: undefined,
      category: '',
      type: 'APARTMENT',
      guest: undefined,
      superhost: false,
      isAvailable: true,
      availableFrom: '',
      amenities: '',
    },
    mode: 'onSubmit',
  })

  const scrollToPhotos = () => {
    document.getElementById('listing-photos')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const ensurePhotos = () => {
    if (photos.length > 0) {
      setPhotoError('')
      return true
    }
    setPhotoError('Please upload at least one photo.')
    scrollToPhotos()
    return false
  }

  const onSubmit = (values: FormValues) => {
    if (!ensurePhotos()) return

    createListing.mutate(
      {
        title: values.title,
        description: values.description,
        location: values.location,
        pricePerNight: values.pricePerNight,
        category: values.category,
        type: values.type,
        guest: values.guest,
        superhost: values.superhost,
        isAvailable: values.isAvailable,
        availableFrom: values.availableFrom,
        amenities: values.amenities
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        imageFiles: photos.map((p) => p.file),
      },
      {
        onSuccess: () => {
          toast.success('Listing submitted for review')
          navigate('/dashboard')
        },
        onError: (e: Error) => toast.error(e.message),
      },
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#f97316]">New listing</p>
        <h1 className="mt-1 text-2xl font-bold text-black">Create listing</h1>
        <p className="mt-2 text-sm text-black/55">
          Your listing will be reviewed by an admin before it appears on the public site.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit, () => ensurePhotos())}
        noValidate
        className="space-y-8 rounded-2xl border border-[#eadfdb] bg-white p-6 sm:p-8"
      >
        <section className="space-y-4 border-t border-[#eadfdb] pt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black/45">Property details</h2>

          <label className={labelClass}>
            Title
            {requiredMark}
            <input
              className={inputClass}
              placeholder="Cozy cabin with mountain views"
              required
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p>
            )}
          </label>

          <label className={labelClass}>
            Description
            {requiredMark}
            <textarea
              rows={4}
              className={inputClass}
              placeholder="Describe the space, neighborhood, and what guests will love…"
              required
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.description.message}</p>
            )}
          </label>

          <label className={labelClass}>
            Location
            {requiredMark}
            <input
              className={inputClass}
              placeholder="City, state or region"
              required
              {...form.register('location')}
            />
            {form.formState.errors.location && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.location.message}</p>
            )}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Price / night ($)
              {requiredMark}
              <input
                type="number"
                min={10}
                className={inputClass}
                required
                {...form.register('pricePerNight')}
              />
              {form.formState.errors.pricePerNight && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.pricePerNight.message}</p>
              )}
            </label>
            <label className={labelClass}>
              Guests
              {requiredMark}
              <input
                type="number"
                min={1}
                max={16}
                className={inputClass}
                required
                {...form.register('guest')}
              />
              {form.formState.errors.guest && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.guest.message}</p>
              )}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Category
              {requiredMark}
              <input
                className={inputClass}
                placeholder="e.g. Design, Beach, Luxury"
                required
                {...form.register('category')}
              />
              {form.formState.errors.category && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.category.message}</p>
              )}
            </label>
            <label className={labelClass}>
              Property type
              {requiredMark}
              <select className={inputClass} required {...form.register('type')}>
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="VILLA">Villa</option>
                <option value="CABIN">Cabin</option>
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-4 border-t border-[#eadfdb] pt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black/45">Availability & extras</h2>

          <label className={labelClass}>
            Amenities
            {requiredMark}
            <input
              className={inputClass}
              placeholder="WiFi, Kitchen, Parking, Pool"
              required
              {...form.register('amenities')}
            />
            <span className="mt-1 block text-xs text-black/45">Separate with commas</span>
            {form.formState.errors.amenities && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.amenities.message}</p>
            )}
          </label>

          <label className={labelClass}>
            Available from
            {requiredMark}
            <input type="date" className={inputClass} required {...form.register('availableFrom')} />
            {form.formState.errors.availableFrom && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.availableFrom.message}</p>
            )}
          </label>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-black">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#eadfdb] text-[#f97316] focus:ring-[#f97316]"
                {...form.register('superhost')}
              />
              Superhost
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-black">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#eadfdb] text-[#f97316] focus:ring-[#f97316]"
                {...form.register('isAvailable')}
              />
              Available for booking
            </label>
          </div>
        </section>

        <section id="listing-photos" className="border-t border-[#eadfdb] pt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black/45">
            Photos
            <span className="text-[#f97316]"> *</span>
          </h2>
          <div className="mt-4">
            <ListingPhotoUpload
              photos={photos}
              onChange={(next) => {
                setPhotos(next)
                if (next.length > 0) setPhotoError('')
              }}
              error={photoError}
            />
          </div>
        </section>

        <div className="border-t border-[#eadfdb] pt-6">
          <button
            type="submit"
            disabled={createListing.isPending}
            className="w-full rounded-xl border border-[#f97316] bg-[#f97316] py-3.5 text-sm font-semibold text-white transition hover:border-black hover:bg-black disabled:opacity-50"
          >
            {createListing.isPending ? 'Submitting…' : 'Submit for review'}
          </button>
        </div>
      </form>
    </div>
  )
}
