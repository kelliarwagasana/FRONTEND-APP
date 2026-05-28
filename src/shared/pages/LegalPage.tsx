import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

interface LegalPageProps {
  title: string
  children: ReactNode
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar variant="solid" />
      <main className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <Link to="/" className="text-sm font-medium text-[#f97316] hover:text-black">
          ← Back to home
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-black">{title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-black/70">{children}</div>
      </main>
    </div>
  )
}
