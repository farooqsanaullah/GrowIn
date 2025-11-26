export default function UserAgreementPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">User Agreement</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using GrowIn, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
          <p>
            GrowIn provides a platform to connect investors with startups. You agree to use this service only for lawful purposes
            and in accordance with this User Agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that
            occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Content</h2>
          <p>
            Users are solely responsible for the content they post on GrowIn. You retain all rights to your content, but
            grant GrowIn a license to use, display, and distribute your content on the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
          <p>
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Posting false, misleading, or fraudulent information</li>
            <li>Violating any laws or regulations</li>
            <li>Harassing or threatening other users</li>
            <li>Attempting to gain unauthorized access to the platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at any time, without prior notice, for conduct that
            we believe violates this User Agreement or is harmful to other users or the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify this User Agreement at any time. Continued use of the service after changes
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
          <p>
            If you have any questions about this User Agreement, please contact us through the platform.
          </p>
        </section>
      </div>
    </div>
  );
}
