export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit our website. They help us
            provide you with a better experience by remembering your preferences and understanding how you use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p>
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authentication:</strong> To keep you signed in to your account</li>
            <li><strong>Security:</strong> To protect your account and detect fraud</li>
            <li><strong>Preferences:</strong> To remember your settings and preferences</li>
            <li><strong>Performance:</strong> To analyze how our service is used and improve it</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>

          <h3 className="text-xl font-semibold mb-2 mt-4">Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core functionality such as
            security, authentication, and accessibility.
          </p>

          <h3 className="text-xl font-semibold mb-2 mt-4">Session Cookies</h3>
          <p>
            We use session cookies to keep you logged in during your visit. These cookies are temporary and are
            deleted when you close your browser.
          </p>

          <h3 className="text-xl font-semibold mb-2 mt-4">Authentication Cookies</h3>
          <p>
            When you sign in using credentials or OAuth providers (Google, GitHub), we use cookies to verify your
            identity and maintain your session.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
          <p>
            When you use OAuth authentication (Google or GitHub), these providers may set their own cookies.
            These cookies are governed by the respective privacy policies of these providers:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google Privacy Policy</li>
            <li>GitHub Privacy Policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
          <p>
            You can control and manage cookies in various ways:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Most browsers allow you to refuse cookies or delete cookies already stored</li>
            <li>You can adjust your browser settings to notify you when cookies are being sent</li>
            <li>Please note that disabling cookies may affect the functionality of our service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Cookie Duration</h2>
          <p>
            Session cookies are temporary and expire when you close your browser. Persistent cookies remain on your
            device until they expire or you delete them. Authentication cookies typically last for 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other
            operational, legal, or regulatory reasons.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us through the platform.
          </p>
        </section>
      </div>
    </div>
  );
}
