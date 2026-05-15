import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Spinner from '../../../shared/components/Spinner'
import { useListing } from '../../listings/hooks/useListing'
import { useUpdateListing } from '../hooks'

const schema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(2),
  pricePerNight: z.number().min(10, 'Minimum price is $10'),
  category: z.string().min(1),
  type: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'CABIN']),
  guest: z.number().min(1).max(16),
  superhost: z.boolean(),
  isAvailable: z.boolean(),
  availableFrom: z.string(),
  amenities: z.string(),
})

type FormValues = z.infer<typeof schema>

export default function EditListingPage() {
  const { listingId } = useParams<{ listingId: string }>()
  const navigate = useNavigate()
  const listingQuery = useListing(listingId)
  const updateListing = useUpdateListing(listingId)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const l = listingQuery.data
    if (!l) return
    form.reset({
      title: l.title,
      description: l.description ?? '',
      location: l.location,
      pricePerNight: l.pricePerNight,
      category: l.category ?? l.type,
      type: l.type,
      guest: l.guest,
      superhost: l.superhost ?? false,
      isAvailable: l.isAvailable ?? true,
      availableFrom: l.availableFrom ?? l.createdAt.slice(0, 10),
      amenities: l.amenities.join(', '),
    })
  }, [listingQuery.data, form])

  const onSubmit = (values: FormValues) => {
    if (!listingId) return
    updateListing.mutate(
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
        amenities: values.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      },
      {
        onSuccess: () => {
          toast.success('Listing updated')
          navigate('/dashboard')
        },
        onError: (e: Error) => toast.error(e.message),
      },
    )
  }

  if (listingQuery.isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3">
        <Spinner />
        <span className="text-sm text-slate-600">Loading listing…</span>
      </div>
    )
  }

  if (listingQuery.isError || !listingQuery.data) {
    return <p className="text-sm text-red-600">Listing not found.</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#292626]">Edit listing</h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-[#eadfdb] bg-white p-6 shadow-sm">
        <label className="block text-sm font-semibold">
          Title
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p>
          )}
        </label>
        <label className="block text-sm font-semibold">
          Description
          <textarea rows={4} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" {...form.register('description')} />
          {form.formState.errors.description && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.description.message}</p>
          )}
        </label>
        <label className="block text-sm font-semibold">
          Location
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" {...form.register('location')} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Price / night
            <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" {...form.register('pricePerNight', { valueAsNumber: true })} />
          </label>
          <label className="block text-sm font-semibold">
            Guests
            <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" {...form.register('guest', { valueAsNumber: true })} />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Category
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" {...form.register('category')} />
        </label>
        <label className="block text-sm font-semibold">
          Type
          <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" {...form.register('type')}>
            <option value="APARTMENT">Apartment</option>
            <option value="HOUSE">House</option>
            <option value="VILLA">Villa</option>
            <option value="CABIN">Cabin</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" {...form.register('superhost')} />
          Superhost
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" {...form.register('isAvailable')} />
          Available for booking
        </label>
        <label className="block text-sm font-semibold">
          Available from
          <input type="date" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" {...form.register('availableFrom')} />
        </label>
        <label className="block text-sm font-semibold">
          Amenities (comma-separated)
          <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" {...form.register('amenities')} />
        </label>
        {listingQuery.data?.photos[0]?.url && (
          <img src={listingQuery.data.photos[0].url} alt="" className="max-h-56 rounded-xl border object-cover" />
        )}

        <button
          type="submit"
          disabled={updateListing.isPending}
          className="w-full rounded-xl bg-[#f97316] py-3 text-sm font-black text-white hover:bg-black disabled:opacity-50"
        >
          {updateListing.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
