import { Link } from 'react-router-dom'
import { FiGlobe } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6'

const currentYear = new Date().getFullYear()

function PrivacyChoicesIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0"
      aria-hidden
    >
      <rect x="1" y="3" width="14" height="10" rx="2" fill="#4285F4" />
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="site-footer w-full shrink-0 border-t border-[#dddddd] bg-[#f7f7f7]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-5 md:px-10 lg:px-16">
        <div className="site-footer__copy flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span>© {currentYear} AirBnb, Inc.</span>
          <span className="site-footer__dot" aria-hidden>
            ·
          </span>
          <Link to="/privacy" className="site-footer__link underline">
            Privacy
          </Link>
          <span className="site-footer__dot" aria-hidden>
            ·
          </span>
          <Link to="/terms" className="site-footer__link underline">
            Terms
          </Link>
          <span className="site-footer__dot" aria-hidden>
            ·
          </span>
          <Link to="/privacy#choices" className="site-footer__link inline-flex items-center gap-1.5 underline">
            Your Privacy Choices
            <PrivacyChoicesIcon />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <button
            type="button"
            className="site-footer__link inline-flex items-center gap-2 underline"
            aria-label="Language: English (US)"
          >
            <FiGlobe className="text-base" aria-hidden />
            English (US)
          </button>
          <button
            type="button"
            className="site-footer__link inline-flex items-center gap-1 underline"
            aria-label="Currency: US Dollar"
          >
            <span className="text-base font-semibold" aria-hidden>
              $
            </span>
            USD
          </button>
          <div className="flex items-center gap-4" aria-label="Social media">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__link transition"
              aria-label="AirBnb on Facebook"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__link transition"
              aria-label="AirBnb on X"
            >
              <FaXTwitter className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__link transition"
              aria-label="AirBnb on Instagram"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
