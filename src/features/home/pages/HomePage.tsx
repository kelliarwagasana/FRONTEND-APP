import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../shared/components/Navbar'
import Footer from '../../../shared/components/Footer'
import ListingCard from '../../listings/components/ListingCard'
import { useListings } from '../../listings/hooks/useListings'
import Spinner from '../../../shared/components/Spinner'
import { uptownHouseImage } from '../../../shared/brandImages'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const listingsQuery = useListings()
  const featuredListings = (listingsQuery.data ?? []).slice(0, 4)


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-white text-black">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${uptownHouseImage})` }}
      />
      <div
        className={`fixed inset-0 transition-all duration-500 ${
          isScrolled ? 'bg-white/95' : 'bg-black/55'
        }`}
      />
      <div
        className={`fixed inset-0 bg-gradient-to-b transition-all duration-500 ${
          isScrolled
            ? 'from-white/90 via-white/70 to-white/100'
            : 'from-black/10 via-black/30 to-black/95'
        }`}
      />

      <Navbar />

      <main className={`relative ${isScrolled ? 'pt-24' : ''}`}>
        <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-end gap-10 px-6 pb-16 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="w-full max-w-4xl space-y-7 border-l-8 border-[#f97316] pl-6 text-left"
          >
            <motion.p
              variants={fadeUp}
              className={`text-sm font-semibold uppercase tracking-[0.35em] ${
                isScrolled ? 'text-black/70' : 'text-white/85'
              }`}
            >
             
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className={`max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7x1 lg:text-7x1 ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              Stays with a sharper point of view.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className={`max-w-2x1 text-base leading-8 text-md ${
                isScrolled ? 'text-black/70' : 'text-white/85'
              }`}
            >
              Browse curated apartments, houses, villas, and cabins. Book securely and discover authentic experiences worldwide.
            </motion.p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="w-full bg-white p-4 border-rounded shadow-md rounded-md lg:ml-auto lg:max-w-md"
          >
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#f97316]">Start here</p>
            <h2 className="mt-3 text-2x6 font-black text-black">Build your shortlist</h2>
            <div className="mt-6 grid gap-3">
              <label className="grid gap-2 shadow-md bg-transparent px-4 py-3">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-black/50">Search</span>
                <input
                  type="search"
                  placeholder="Search places, cities..."
                  className="w-full bg-transparent text-sm font-bold text-black outline-none shadow-md p-2 placeholder:text-black/35"
                />
              </label>
              <label className="grid gap-2  bg-white px-4 py-3 rounded-xl shadow-md">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-black/50">Location</span>
                <select className="w-full bg-transparent text-sm font-bold text-black outline-none">
                  <option>Location</option>
                  <option>Tulum, Mexico</option>
                  <option>Lisbon, Portugal</option>
                  <option>Tokyo, Japan</option>
                </select>
              </label>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center  bg-[#f97316] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-black"
              >
                Explore stays
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="relative z-10  bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-10 grid gap-6  pb-8 md:grid-cols-[0.8fr_1.2fr_auto] md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f97316]">Featured properties</p>
              </div>
              <h2 className="text-3xl font-black text-black sm:text-3xl">
                Handpicked homes, rebuilt into a bolder catalog.
              </h2>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center  px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#f97316]"
              >
                Explore more
              </Link>
            </div>

            {listingsQuery.isPending ? (
              <div className="flex justify-center py-16">
                <Spinner />
              </div>
            ) : featuredListings.length === 0 ? (
              <p className="text-sm font-semibold text-slate-600">No listings published yet.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featuredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}

