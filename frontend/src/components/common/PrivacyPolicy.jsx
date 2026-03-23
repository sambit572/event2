import { Seo } from "../../seo/seo";

/**
 * PrivacyPolicy.jsx
 * A clean, contract-style Privacy & Policy page component styled with Tailwind CSS.
 * Structured with lists for clear, itemized formatting.
 * Usage: <PrivacyPolicy siteName="Eventsbridge" lastUpdated="August 12, 2025" />
 */
export default function PrivacyPolicy({
  siteName = "@EVENTSBRIDGE",
  lastUpdated = "October 16, 2025",
}) {
  return (
    // Main container
    <>
      <Seo
        title={"Privacy Policy"}
        description={
          "Learn about how Eventsbridge protects your privacy and handles data. Read our full privacy policy for transparency on user and vendor information."
        }
      />
      <main className="bg-gray-50 antialiased text-gray-800">
        {/* Content card */}
        <article className="max-w-4xl mx-auto my-8 sm:my-12 p-6 sm:p-10 md:p-12 bg-white rounded-lg shadow-md">
          {/* Page Header */}
          <header className="pb-6 border-b border-gray-200 items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Privacy Policy
            </h1>
          </header>

          {/* Introduction Section */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">
              Introduction
            </h2>
            {/* Reverted to a list format for the introductory points */}
            <ul className="list-disc list-inside space-y-3 text-gray-600 leading-relaxed">
              <li>
                We respect your privacy and are committed to protecting your
                personal information. By using our website you agree to this
                policy. If you do not agree, please do not use the site.
              </li>
              <li>
                This policy covers data collected on our domain and subdomains.
                We are not responsible for external sites linked from our
                platform; please read those sites' policies before providing
                personal information.
              </li>
            </ul>
          </section>

          {/* Cookie & Data Practices Section */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">
              1. Cookie & Data Practices
            </h2>
            {/* Structured as an ordered list for clarity */}
            <ol className="list-decimal list-inside space-y-4 text-gray-600 leading-relaxed">
              <li>
                We use cookies to improve your experience, remember preferences,
                and analyze site usage. Cookies may be session (deleted when you
                close the browser) or persistent (remain until expiry or
                deletion).
              </li>
              <li>
                Cookie categories we use:
                <ul className="list-[circle] list-inside space-y-2 ml-6 mt-2">
                  <li>
                    <strong className="font-medium text-gray-700">
                      Essential:
                    </strong>{" "}
                    Required for site functionality.
                  </li>
                  <li>
                    <strong className="font-medium text-gray-700">
                      Functional:
                    </strong>{" "}
                    Remember user preferences.
                  </li>
                  <li>
                    <strong className="font-medium text-gray-700">
                      Analytics:
                    </strong>{" "}
                    Help measure and improve our services.
                  </li>
                  <li>
                    <strong className="font-medium text-gray-700">
                      Advertising:
                    </strong>{" "}
                    Serve relevant ads with trusted partners.
                  </li>
                </ul>
              </li>
              <li>
                You can manage or delete cookies through your browser settings.
                Third-party cookies on our pages are controlled by those third
                parties and not by us.
              </li>
            </ol>
          </section>

          {/* User Policy Section */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">
              2. User Policy
            </h2>
            {/* Main points are list items for clear enumeration */}
            <ol className="space-y-6">
              <li>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2.1 Damage Liability
                </h3>
                <p className="text-gray-600 leading-relaxed pl-6">
                  If a user damages vendor property, equipment, or materials
                  while services are provided, the user is responsible for full
                  compensation to the vendor for the loss or damage.
                </p>
              </li>
              <li>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2.2 Cancellation by User
                </h3>
                <p className="text-gray-600 leading-relaxed pl-6">
                  Users may cancel per the refund policy. Cancellations made
                  less than five (5) days before the event will forfeit the full
                  advance payment unless the platform accepts a legitimate
                  reason.
                </p>
              </li>
              <li>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2.3 Payment of Remaining Amount
                </h3>
                <p className="text-gray-600 leading-relaxed pl-6">
                  The user must pay the remaining balance (80% of the total). If
                  the user refuses or fails to pay without a valid, documented
                  reason while the vendor is ready to provide services, the
                  platform may assist the vendor in legal remedies.
                </p>
              </li>
              <li>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2.4 Vendor Cancellation Protection
                </h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-600 leading-relaxed pl-6">
                  <li>
                    If the vendor cancels within five (5) days of the event, we
                    will try to find a replacement vendor of equivalent quality
                    at the originally negotiated price, subject to availability.
                  </li>
                  <li>
                    If the vendor cancels more than five (5) days before the
                    event, we will assist in finding a replacement but are not
                    obligated to maintain the original pricing or conditions.
                  </li>
                  <li>
                    In both cases we will inform the user of the reason for
                    cancellation and actions being taken.
                  </li>
                </ol>
              </li>
            </ol>
          </section>

          {/* Vendor Policy Section */}
          <section className="py-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">
              3. Vendor Policy
            </h2>
            <ol className="space-y-6">
              <li>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3.1 Data Handling
                </h3>
                <div className="space-y-4 text-gray-600 leading-relaxed pl-6">
                  <p id="3.1.1">
                    We collect and securely store vendor information (e.g., PAN,
                    GST, bank details). Data is encrypted and retained while the
                    vendor is associated with the platform and for an additional
                    three (3) years after departure for dispute resolution,
                    legal compliance, and audits, in accordance with applicable
                    Indian laws.
                  </p>
                  <div id="3.1.2">
                    <p>
                      <strong className="font-medium text-gray-700">
                        Use of Vendor Content for Marketing:
                      </strong>{" "}
                      Vendors may upload videos, images, or other content
                      ("Vendor Content") to the platform. With the vendor’s
                      consent, such Vendor Content may be used by the platform
                      for marketing, promotional, and advertising purposes
                      across our website, social media, and other communication
                      channels. Each Vendor Content will clearly identify the
                      vendor and their association with the platform, ensuring
                      mutual promotion and recognition.
                    </p>
                    <p className="mt-4 font-medium text-gray-700">
                      Disclaimer and Limitations:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                      <li>
                        Vendors must ensure their content does not infringe on
                        the intellectual property, privacy, or rights of third
                        parties.
                      </li>
                      <li>
                        The platform will not modify Vendor Content in a manner
                        that misrepresents the vendor, their services, or their
                        association with the platform.
                      </li>
                      <li>
                        Vendors may request removal of their content from
                        marketing channels at any time, subject to reasonable
                        notice and technical feasibility.
                      </li>
                      <li>
                        The platform will comply with all applicable laws
                        regarding content usage, including copyright, data
                        protection, and advertising regulations.
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3.2 Payment Terms
                </h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-600 leading-relaxed pl-6">
                  <li>
                    Vendors will receive their portion of the advance within one
                    to three (1–3) working days after booking confirmation.
                    Disbursements occur between 9:00 AM and 10:00 PM operational
                    hours.
                  </li>
                  <li>
                    The advance equals twenty percent (20%) of the total booking
                    value. After deducting the platform fee (5% of advance) and
                    payment gateway charges, vendors typically receive
                    approximately ninety-three percent (93%) of the advance
                    amount.
                  </li>
                  <li>
                    If the user cancels, vendors may need to refund a portion of
                    the advance per the refund policy.
                  </li>
                </ol>
              </li>
              <li>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3.3 Cancellation by Vendor
                </h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-600 leading-relaxed pl-6">
                  <li>
                    Vendors must refund 100% of the advance if they cancel a
                    confirmed booking.
                  </li>
                  <li>
                    If cancellation occurs within five (5) days before the
                    event, the vendor will be penalized 10% of the total amount
                    (plus payment gateway charges). The penalty will be deducted
                    from the vendor's next successful booking. Verified natural
                    disasters or legitimate emergencies (as determined by the
                    platform) are exceptions.
                  </li>
                </ol>
              </li>
              <li>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3.4 Vendor Payment Protection
                </h3>
                <p className="text-gray-600 leading-relaxed pl-6">
                  If a vendor lawfully provides services but the user refuses or
                  fails to pay the remaining amount, the platform will
                  reasonably support the vendor in pursuing legal or regulatory
                  remedies, provided the vendor complied with platform policies
                  and applicable laws.
                </p>
              </li>
            </ol>
          </section>

          {/* Contact & Legal Section */}
          <section className="py-8">
            <h2 className="text-2xl font-semibold text-blue-500 mb-4">
              4. Contact & Legal
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-600 leading-relaxed">
              <li>
                For questions about this policy or data processing, contact us
                via the contact channel on our website.
              </li>
            </ol>
          </section>

          {/* Page Footer */}
          <footer className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
              <span className="font-bold text-gray-800 mb-2 sm:mb-0">
                {siteName}
              </span>
              <span>
                Last updated:{" "}
                <strong className="font-medium text-gray-700">
                  {lastUpdated || "—"}
                </strong>
              </span>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
