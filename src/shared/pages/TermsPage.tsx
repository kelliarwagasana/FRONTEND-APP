import LegalPage from './LegalPage'

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        By using AirBnb you agree to these terms. Guests may browse listings, save favorites, and book stays. Hosts may
        create and manage listings subject to platform moderation.
      </p>
      <p>
        Bookings are subject to host confirmation. Cancellations follow the status shown in your bookings page. Hosts
        are responsible for accurate listing descriptions, pricing, and availability.
      </p>
      <p>
        AirBnb may suspend accounts that violate these terms or misuse the platform. For questions, contact{' '}
        <a href="mailto:support@airbnb.com" className="text-[#f97316] underline">
          support@airbnb.com
        </a>{' '}
        or call (123) 456-7890.
      </p>
    </LegalPage>
  )
}
