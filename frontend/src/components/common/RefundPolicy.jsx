// RefundPolicy.jsx
import React from "react";
import { Seo } from "../../seo/seo";

export default function RefundPolicy({
  siteName = "@ EVENTSBRIDGE",
  lastUpdated = "August 12, 2025",
}) {
  return (
    <>
      <Seo
        title={"Refund Policy"}
        description={
          "Learn about Eventsbridge refund and cancellation policy. Understand how refunds work, eligibility, timeframes and terms for event bookings."
        }
      />
      <main className="flex justify-center items-center bg-[#fafafa] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-10">
        <article className="w-full max-w-5xl bg-white rounded-xl shadow-md p-5 sm:p-8 md:p-10 lg:p-12 text-base sm:text-[17px] leading-relaxed text-[#222]">
          {/* Header */}
          <header className="text-center mb-6">
            <h1 className="mb-6 text-2xl sm:text-3xl md:text-4xl font-bold underline text-[var(--accent)] font-sans">
              Refund Policy
            </h1>
          </header>

          {/* Section */}
          <section className="mt-5">
            <h2 className="my-3 text-lg sm:text-xl font-semibold text-[var(--accent)]">
              Introduction
            </h2>
            <p className="mb-4">
              We value the trust you place in our platform and are committed to
              providing fair and transparent refund practices. This Refund
              Policy explains the conditions under which refunds may be granted
              for bookings, products, or services purchased through our
              platform.
            </p>
            <p>
              The advance payment made at the time of booking is refundable to
              the user on a partial basis, depending on the number of days
              remaining before the scheduled event. The refund structure is as
              follows:
            </p>

            <ul className="list-disc pl-5 sm:pl-6 mt-6 space-y-4 sm:space-y-5">
              <li>
                If the cancellation occurs{" "}
                <strong>
                  more than fifteen (15) days prior to the event date
                </strong>
                , fifty percent (50%) of the advance amount will be refunded,
                excluding applicable payment gateway charges.
              </li>
              <li>
                If the cancellation occurs{" "}
                <strong>
                  between ten (10) and fifteen (15) days prior to the event date
                </strong>
                , twenty percent (20%) of the advance amount will be refunded,
                excluding applicable payment gateway charges.
              </li>
              <li>
                If the cancellation occurs{" "}
                <strong>
                  between five (5) and ten (10) days prior to the event date
                </strong>
                {/* , fifty percent (50%) of the advance amount will be refunded, */}
                , excluding applicable payment gateway charges.
              </li>
              <li>
                If the cancellation occurs{" "}
                <strong>less than five (5) days prior to the event date</strong>
                , the advance amount is non-refundable, except in cases
                involving valid, provable reasons as determined by the platform.
              </li>
              <li>
                All eligible refunds shall be processed within{" "}
                <strong>five to seven (5–7)</strong> working days during
                standard operational hours{" "}
                <strong>(9:00 AM to 10:00 PM)</strong>.
              </li>
            </ul>
          </section>

          {/* Footer */}
          <footer className="border-t mt-8 pt-4 text-center text-sm text-gray-600">
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <span>
                <strong>{siteName}</strong>
              </span>
              <span className="text-gray-400">|</span>
              <span>
                Last updated: <strong>{lastUpdated || "—"}</strong>
              </span>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
