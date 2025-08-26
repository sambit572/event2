// RefundPolicy.jsx
import React from "react";
import "./RefundPolicy.css";

export default function RefundPolicy({
  siteName = "@ EVENTSBRIDGE",
  lastUpdated = "August 12, 2025",
}) {
  return (
    <main className="rp-container">
      <article className="rp-card">
        <header className="rp-header">
          <h1>Refund Policy</h1>
        </header>

        <section className="rp-section">
          <h2>Introduction</h2>
          <ol>
            <li>
              We value the trust you place in our platform and are committed to
              providing fair and transparent refund practices. This Refund
              Policy explains the conditions under which refunds may be granted
              for bookings, products, or services purchased through our
              platform.
            </li>{" "}
            <br />
            <li>
              The advance payment made at the time of booking is refundable to
              the user on a partial basis, depending on the number of days
              remaining before the scheduled event. The refund structure is as
              follows:
            </li>{" "}
            <br />
          </ol>

          <ul className="rp-list">
            <li>
              If the cancellation occurs{" "}
              <strong>
                more than fifteen (15) days prior to the event date
              </strong>
              , ninety percent (90%) of the advance amount will be refunded,
              excluding applicable payment gateway charges.
            </li>
            <li>
              If the cancellation occurs{" "}
              <strong>
                between ten (10) and fifteen (15) days prior to the event date
              </strong>
              , seventy percent (70%) of the advance amount will be refunded,
              excluding applicable payment gateway charges.
            </li>
            <li>
              If the cancellation occurs{" "}
              <strong>
                between five (5) and ten (10) days prior to the event date
              </strong>
              , fifty percent (50%) of the advance amount will be refunded,
              excluding applicable payment gateway charges.
            </li>
            <li>
              If the cancellation occurs{" "}
              <strong>less than five (5) days prior to the event date</strong>,
              the advance amount is non-refundable, except in cases involving
              valid, provable reasons as determined by the platform.
            </li>
            <li>
              All eligible refunds shall be processed within{" "}
              <strong>five to seven (5–7)</strong> working days during standard
              operational hours <strong>(9:00 AM to 10:00 PM)</strong>.
            </li>
          </ul>
        </section>

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
      </article>
    </main>
  );
}
