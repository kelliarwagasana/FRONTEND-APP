import LegalPage from './LegalPage'

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        AirBnb respects your privacy. We collect information you provide when you create an account, book a stay, list a
        property, or contact support at{' '}
        <a href="mailto:support@airbnb.com" className="text-[#f97316] underline">
          support@airbnb.com
        </a>
        .
      </p>
      <p>
        We use your data to operate bookings, host dashboards, reviews, and account security. We do not sell your
        personal information to third parties.
      </p>
      <p id="choices">
        <strong>Your Privacy Choices.</strong> You may update your profile, delete saved listings, and request account
        changes from your profile page. For data requests, email support with the subject line &quot;Privacy
        request&quot;.
      </p>
    </LegalPage>
  )
}
