// PrivacyPolicy.jsx
import React from "react";
import "./PrivacyPolicy.css";

/**
 * PrivacyPolicy.jsx
 * A clean, contract-style Privacy & Policy page component.
 * Usage: <PrivacyPolicy siteName="Eventsbridge" lastUpdated="August 12, 2025" />
 */
export default function PrivacyPolicy({
  siteName = "@ EVENTSBRIDGE",
  lastUpdated = "August 12, 2025",
}) {
  return (
    <main className="pp-container">
      <article className="pp-card">
        <header className="pp-header">
          <h1>Legal Information</h1>
        </header>

        <section className="pp-section">
          <h2>Introduction</h2>
          <ul>
            <li>
              We respect your privacy and are committed to protecting your
              personal information. By using our website you agree to this
              policy. If you do not agree, please do not use the site.
            </li>{" "}
            <br />
            <li>
              This policy covers data collected on our domain and subdomains. We
              are not responsible for external sites linked from our platform;
              please read those sites' policies before providing personal
              information.
            </li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>1. Platform Fee Structure</h2>
          <ol>
            <li>
              <strong>Fee on advance payment:</strong> We charge 5% on the
              advance payment collected at booking time. The advance payment
              equals 20% of the total booking amount.
            </li>
            <br />
            <li>
              <strong>Effective fee:</strong> Because the advance is 20% of the
              total, a 5% fee on that advance equals an effective fee of 1.5% of
              the total booking value.
            </li>{" "}
            <br />
            <li>
              <strong>Example:</strong> If total = ₹10,000 → advance = ₹2,000 →
              platform fee = 5% of ₹2,000 = ₹100 → effective fee = 1.5% of
              ₹10,000.
            </li>
          </ol>
        </section>

        <section className="pp-section">
          <h2>2. Cookie & Data Practices</h2>
          <ol>
            <li>
              We use cookies to improve your experience, remember preferences,
              and analyze site usage. Cookies may be session (deleted when you
              close the browser) or persistent (remain until expiry or
              deletion).
              <br />
            </li>
          </ol>
          <ol>
            <li>Cookie categories we use:</li>
            <ul style={{ listStyleType: "circle" }}>
              <li>
                <strong>Essential:</strong> Required for site functionality.
              </li>
              <li>
                <strong>Functional:</strong> Remember user preferences.
              </li>
              <li>
                <strong>Analytics:</strong> Help measure and improve our
                services.
              </li>
              <li>
                <strong>Advertising:</strong> Serve relevant ads with trusted
                partners.
              </li>
            </ul>

            <p>
              You can manage or delete cookies through your browser settings.
              Third-party cookies on our pages are controlled by those third
              parties and not by us.
            </p>
          </ol>
        </section>

        <section className="pp-section">
          <h2>3. User Policy</h2>
          <ol>
            <h3>3.1 Damage Liability</h3>
            <ol>
              <li>
                If a user damages vendor property, equipment, or materials while
                services are provided, the user is responsible for full
                compensation to the vendor for the loss or damage.
              </li>
            </ol>

            <h3>3.2 Cancellation by User</h3>
            <ol>
              <li>
                Users may cancel per the refund policy. Cancellations made less
                than five (5) days before the event will forfeit the full
                advance payment unless the platform accepts a legitimate reason.
              </li>
            </ol>

            <h3>3.3 Payment of Remaining Amount</h3>
            <ol>
              <li>
                The user must pay the remaining balance (80% of the total). If
                the user refuses or fails to pay without a valid, documented
                reason while the vendor is ready to provide services, the
                platform may assist the vendor in legal remedies.
              </li>
            </ol>

            <h3>3.4 Vendor Cancellation Protection</h3>
            <ol>
              <li>
                If the vendor cancels within five (5) days of the event, we will
                try to find a replacement vendor of equivalent quality at the
                originally negotiated price, subject to availability.
              </li>
              <li>
                If the vendor cancels more than five (5) days before the event,
                we will assist in finding a replacement but are not obligated to
                maintain the original pricing or conditions.
              </li>
              <li>
                In both cases we will inform the user of the reason for
                cancellation and actions being taken.
              </li>
            </ol>
          </ol>
        </section>

        <section className="pp-section">
          <h2>4. Vendor Policy</h2>
          <ol>
            <h3>4.1 Data Handling</h3>
            <ol>
              <li>
                We collect and securely store vendor information (e.g., PAN,
                GST, bank details). Data is encrypted and retained while the
                vendor is associated with the platform and for an additional
                three (3) years after departure for dispute resolution, legal
                compliance, and audits, in accordance with applicable Indian
                laws.
              </li>
            </ol>

            <h3>4.2 Payment Terms</h3>
            <ol>
              <li>
                Vendors will receive their portion of the advance within one to
                three (1–3) working days after booking confirmation.
                Disbursements occur between 9:00 AM and 10:00 PM operational
                hours.
              </li>
              <li>
                The advance equals twenty percent (20%) of the total booking
                value. After deducting the platform fee (5% of advance) and
                payment gateway charges, vendors typically receive approximately
                ninety-three percent (93%) of the advance amount.
              </li>
              <li>
                If the user cancels, vendors may need to refund a portion of the
                advance per the refund policy.
              </li>
            </ol>

            <h3>4.3 Cancellation by Vendor</h3>
            <ol>
              <li>
                Vendors must refund 100% of the advance if they cancel a
                confirmed booking.
              </li>
              <li>
                If cancellation occurs within five (5) days before the event,
                the vendor will be penalized 10% of the total amount (plus
                payment gateway charges). The penalty will be deducted from the
                vendor's next successful booking. Verified natural disasters or
                legitimate emergencies (as determined by the platform) are
                exceptions.
              </li>
            </ol>

            <h3>4.4 Vendor Payment Protection</h3>
            <ol>
              <li>
                If a vendor lawfully provides services but the user refuses or
                fails to pay the remaining amount, the platform will reasonably
                support the vendor in pursuing legal or regulatory remedies,
                provided the vendor complied with platform policies and
                applicable laws.
              </li>
            </ol>
          </ol>
        </section>

        <section className="pp-section">
          <h2>5. Contact & Legal</h2>
          <ol>
            <li>
              For questions about this policy or data processing, contact us via
              the contact channel on our website.
            </li>{" "}
            <br />
            <li className="pp-note">
              <strong>Note:</strong> Consult a legal advisor to ensure
              compliance with local laws (for example GDPR, CCPA, or Indian data
              protection requirements) before publishing.
            </li>
          </ol>
        </section>

        <footer className="pp-footer">
          <div className="footer-container">
            <span>
              <strong>{siteName}</strong>
            </span>
            <span className="pp-dot"> | </span>
            <span>
              Last updated: <strong>{lastUpdated || "—"}</strong>
            </span>
          </div>
        </footer>
      </article>
    </main>
  );
}
