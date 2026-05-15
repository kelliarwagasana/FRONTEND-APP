import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useCreateListing } from '../hooks'

const schema = z
  .object({
    title: z.string().min(10, 'Title must be at least 10 characters'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    location: z.string().min(2, 'Location is required'),
    pricePerNight: z.number().min(10, 'Minimum price is $10'),
    category: z.string().min(1, 'Category is required'),
    type: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'CABIN']),
    guest: z.number().min(1).max(16),
    superhost: z.boolean(),
    isAvailable: z.boolean(),
    availableFrom: z.string().min(1, 'Pick a date'),
    amenities: z.string(),
    imageFile: z.custom<FileList | undefined>((v) => v === undefined || v instanceof FileList),
  })
  .superRefine((data, ctx) => {
    const file = data.imageFile?.[0]
    if (!file) {
      ctx.addIssue({ code: 'custom', message: 'Cover image is required', path: ['imageFile'] })
    } else if (file.size > 5 * 1024 * 1024) {
      ctx.addIssue({ code: 'custom', message: 'Image must be under 5MB', path: ['imageFile'] })
    }
  })

type FormValues = z.infer<typeof schema>

export default function CreateListingPage() {
  const navigate = useNavigate()
  const createListing = useCreateListing()
  const [preview, setPreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      pricePerNight: 99,
      category: 'Design',
      type: 'APARTMENT',
      guest: 4,
      superhost: false,
      isAvailable: true,
      availableFrom: new Date().toISOString().slice(0, 10),
      amenities: 'WiFi, Kitchen, Workspace',
    },
  })

  const onFile = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) {
      setPreview(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onSubmit = (values: FormValues) => {
    const files = values.imageFile ? Array.from(values.imageFile) : []
    if (files.length === 0) return

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
        amenities: values.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        imageFiles: files,
      },
      {
        onSuccess: () => {
            toast.success('Listing published')
          navigate('/dashboard')
        },
        onError: (e: Error) => toast.error(e.message),
      },
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-1xl font-semibold text-[#292626]">Create listing</h1>
        <p className="mt-1 text-sm text-[#857d7a]">New listings go live on Explore right after you submit.</p>
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
            {form.formState.errors.pricePerNight && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.pricePerNight.message}</p>
            )}
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
        <label className="block text-sm font-semibold">
          Cover image
          <input
            type="file"
            accept="image/*"
            className="mt-1 text-sm"
            onChange={(e) => {
              form.setValue('imageFile', e.target.files ?? undefined)
              onFile(e.target.files)
            }}
          />
          {form.formState.errors.imageFile && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.imageFile.message as string}</p>
          )}
        </label>
        {preview && <img src={preview} alt="" className="max-h-56 rounded-xl border object-cover" />}

        <button
          type="submit"
          disabled={createListing.isPending}
          className="w-full rounded-xl bg-[#f97316] py-3 text-sm font-black text-white hover:bg-black disabled:opacity-50"
        >
          {createListing.isPending ? 'Submitting…' : 'Submit listing'}
        </button>
      </form>
    </div>
  )
}
