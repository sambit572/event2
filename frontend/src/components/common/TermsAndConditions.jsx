import React from "react";
import "./TermsAndConditions.css"; // Import the CSS file
import { Seo } from "../../seo/seo";

const TermsAndConditions = ({
  siteName = "@ EVENTSBRIDGE",
  lastUpdated = "August 12, 2025",
}) => {
  return (
    <>
      <Seo
        title={"Terms & Conditions"}
        description={
          "Read the Eventsbridge terms and conditions. Understand our policies on bookings, vendor agreements, user obligations, and event services."
        }
      />
      <div className="tc-container">
        <div className="tc-card">
          <h1 className="tc-title">Terms & Conditions</h1>

          <p className="tc-intro">
            <strong>
              Welcome to Eventsbridge, which connects local service providers to
              customers. By accessing and using our website, you agree to comply
              with the terms and conditions outlined below. Please read them
              carefully before using our services.
            </strong>
          </p>
          <section className="pp-section">
            <h2>Platform Fee Structure</h2>
            <ol>
              <li>
                <strong>Fee on advance payment:</strong> We charge 5% on the
                advance payment collected at booking time. The advance payment
                equals 20% of the total booking amount.
              </li>
              <br />
              <li>
                <strong>Effective fee:</strong> Because the advance is 20% of
                the total, a 5% fee on that advance equals an effective fee of
                1.5% of the total booking value.
              </li>{" "}
              <br />
              <li>
                <strong>Example:</strong> If total = ₹10,000 → advance = ₹2,000
                → platform fee = 5% of ₹2,000 = ₹100 → effective fee = 1.5% of
                ₹10,000.
              </li>
              <br />
              <li className="bg-yellow-200">
                <strong>**Introductory Offer:</strong> To welcome our partners,
                the platform fee is currently waived for all new vendors.
              </li>
            </ol>
          </section>
          <h2 className="tc-heading">Roles and Responsibilities</h2>
          <p className="tc-text">
            Our platform connects Vendors offering services with Customers
            seeking to purchase or book these offerings. By accessing and using
            our website, you agree to comply with the following terms:
          </p>

          <h3 className="tc-subheading">For Vendors:</h3>
          <p className="tc-text">
            Vendors are responsible for providing accurate, complete, and
            up-to-date information about their services, including descriptions,
            pricing, availability, and any applicable terms of sale. Vendors
            must ensure that all listings comply with applicable Indian laws,
            including but not limited to the{" "}
            <strong>Consumer Protection Act, 2019</strong>,{" "}
            <strong>Goods and Services Tax (GST) Act, 2017</strong>,{" "}
            <strong>Copyright Act, 1957</strong>,{" "}
            <strong>Payment & Settlement Systems Act, 2007</strong>,{" "}
            <strong>
              Information Technology (Intermediary Guidelines and Digital Media
              Ethics Code) Rules, 2021
            </strong>
            , and{" "}
            <strong>
              Digital Personal Data Protection Act, 2023 (DPDP Act)
            </strong>
            . Vendors are solely accountable for the quality, safety, and
            legality of the services they offer and for obtaining all required
            licenses or permits for their operations. Any false or misleading
            information, counterfeit services, or prohibited content, or any
            kind of violence in the time period of providing services which can
            be considered as crime according to police and Indian law, will
            result in suspension or termination of the vendor’s account without
            prior notice.
          </p>

          <h3 className="tc-subheading">For Customers:</h3>
          <p className="tc-text">
            Customers are responsible for reviewing all service details,
            pricing, and policies before making a purchase or booking. Advance
            payments must be made through the platform’s secure payment
            channels, and customers must provide accurate contact and
            event-related information. Customers agree to use services in
            compliance with applicable laws, including{" "}
            <strong>The Indian Contract Act, 1872</strong>,{" "}
            <strong>Consumer Protection Act, 2019</strong>,{" "}
            <strong>Payment & Settlement Systems Act, 2007</strong>, and{" "}
            <strong>
              Information Technology (Intermediary Guidelines and Digital Media
              Ethics Code) Rules, 2021
            </strong>
            , as well as any local regulations relating to event permissions
            (such as fire safety, noise restrictions, and alcohol licenses).
            Refunds, cancellations, and rescheduling will be governed by the
            respective Vendor’s policy as stated on their service listing,
            subject to the <strong>Consumer Protection Act, 2019</strong>.
          </p>

          <h3 className="tc-subheading">Platform Disclaimer:</h3>
          <p className="tc-text">
            Our platform acts solely as an intermediary between Vendors and
            Customers. We do not manufacture, sell, or guarantee any services
            listed, nor are we liable for disputes, damages, or losses arising
            from transactions between users. However, we reserve the right to
            mediate disputes at our sole discretion in accordance with our
            dispute resolution process and in compliance with the{" "}
            <strong>Arbitration and Conciliation Act, 1996</strong> and{" "}
            <strong>Information Technology Act, 2000</strong>.
          </p>

          <h2 className="tc-heading">
            Legal Compliance & Additional Regulations
          </h2>
          <p className="tc-text">
            In addition to the acts mentioned above, Vendors and Customers must
            comply with any other applicable central, state, or local laws
            governing event management, online transactions, and content
            sharing. These include, but are not limited to:
          </p>
          <ul className="tc-list">
            <li>
              <strong>Information Technology Act, 2000</strong> – Governs online
              activities, cybersecurity, electronic contracts, and data
              protection.
            </li>
            <li>
              <strong>
                Information Technology (Intermediary Guidelines and Digital
                Media Ethics Code) Rules, 2021
              </strong>{" "}
              – Sets compliance requirements for intermediaries and online
              platforms, including user data handling and content moderation.
            </li>
            <li>
              <strong>Indian Penal Code, 1860</strong> – Prohibits fraud,
              misrepresentation, breach of trust, and criminal misconduct.
            </li>
            <li>
              <strong>Payment & Settlement Systems Act, 2007</strong> –
              Regulates secure and legal payment processing for online
              transactions.
            </li>
            <li>
              <strong>Arbitration and Conciliation Act, 1996</strong> – Provides
              a framework for resolving disputes through arbitration instead of
              court proceedings.
            </li>
            <li>
              <strong>Consumer Protection Act, 2019</strong> – Safeguards
              customers against unfair trade practices and ensures grievance
              redressal.
            </li>
            <li>
              <strong>FSSAI Regulations</strong> – Applicable to vendors
              providing catering or food-related services, ensuring hygiene and
              safety standards.
            </li>
            <li>
              <strong>Shops and Establishments Acts</strong> – Compliance with
              respective state-level labor laws, operational timings, and
              employee welfare rules.
            </li>
            <li>
              <strong>
                Noise Pollution (Regulation and Control) Rules, 2000
              </strong>{" "}
              – Restrictions on permissible sound levels during events to
              prevent disturbances.
            </li>
            <li>
              <strong>Copyright Act, 1957</strong> – Protects against
              unauthorized use of copyrighted materials like music, photographs,
              and event designs.
            </li>
            <li>
              <strong>GST Act, 2017</strong> – Governs taxation on goods and
              services provided by vendors and service providers.
            </li>
            <li>
              <strong>
                Digital Personal Data Protection Act, 2023 (DPDP Act)
              </strong>{" "}
              – Regulates the collection, storage, processing, and sharing of
              personal data such as phone numbers, email addresses, and other
              sensitive information, ensuring vendors handle such data lawfully
              and with user consent.
            </li>
          </ul>
          <footer className="pp-footer">
            <div className="footer-container">
              <span>
                <strong>{siteName}</strong>
              </span>
              <span className="rp-dot">|</span>
              <span>
                Last updated: <strong>{lastUpdated || "—"}</strong>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
