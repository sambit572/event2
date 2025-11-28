import React from "react";
import { Link, useNavigate } from "react-router-dom";

const MyApproach = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full text-white bg-[#0b0f19]">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our Approach at EventsBridge
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          Connecting customers with trusted event vendors through a seamless,
          transparent, and smart booking experience.
        </p>
      </section>

      {/* 3-STEP PROCESS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#141a28] rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">1. Discover</h3>
            <p className="text-gray-300">
              Customers explore categories, compare vendors, view portfolios,
              and read authentic reviews before booking.
            </p>
          </div>

          <div className="p-6 bg-[#141a28] rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">2. Connect</h3>
            <p className="text-gray-300">
              Vendors receive customer inquiries instantly and respond with
              pricing, availability, and service details.
            </p>
          </div>

          <div className="p-6 bg-[#141a28] rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">3. Book & Manage</h3>
            <p className="text-gray-300">
              Customers finalize bookings and vendors manage schedules easily —
              all from within EventsBridge.
            </p>
          </div>
        </div>
      </section>

      {/* CUSTOMER APPROACH */}
      <section className="bg-[#111522] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Our Approach for Customers
          </h2>
          <p className="text-gray-300 mb-6">
            At EventsBridge, we focus on making event planning smooth and
            worry-free. Whether it's a wedding, party, corporate event, or
            festival — we help you find the right vendor at the right price.
          </p>

          <ul className="space-y-3 text-gray-300">
            <li>✔ Verified and trusted vendors</li>
            <li>✔ Transparent pricing and easy comparisons</li>
            <li>✔ Real reviews from real customers</li>
            <li>✔ Instant booking and chat with vendors</li>
            <li>✔ No hidden fees — everything upfront</li>
          </ul>
        </div>
      </section>

      {/* VENDOR APPROACH */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Our Approach for Vendors</h2>
          <p className="text-gray-300 mb-6">
            Vendors are the backbone of EventsBridge. We help them grow their
            business by providing exposure, tools, and a reliable customer flow.
          </p>

          <ul className="space-y-3 text-gray-300">
            <li>✔ Genuine customer leads — no spam</li>
            <li>✔ Smart scheduling & booking management</li>
            <li>✔ Online portfolio to showcase services</li>
            <li>✔ Review system to build trust</li>
            <li>✔ Analytics to understand performance</li>
          </ul>
        </div>
      </section>

      {/* WHY EVENTSBRIDGE WORKS */}
      <section className="bg-[#111522] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Why EventsBridge Works</h2>

          <div className="grid md:grid-cols-3 gap-8 text-gray-300">
            <div className="p-6 bg-[#141a28] rounded-xl border border-gray-700">
              <h4 className="text-xl font-semibold mb-2">Trust</h4>
              <p>Verified vendors, secure bookings, and real reviews.</p>
            </div>

            <div className="p-6 bg-[#141a28] rounded-xl border border-gray-700">
              <h4 className="text-xl font-semibold mb-2">Transparency</h4>
              <p>No hidden costs; everything is shown upfront.</p>
            </div>

            <div className="p-6 bg-[#141a28] rounded-xl border border-gray-700">
              <h4 className="text-xl font-semibold mb-2">Seamless Process</h4>
              <p>From choosing to booking — everything happens effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Event?</h2>
        <p className="text-gray-300 mb-6">
          Explore categories and find the perfect vendors now.
        </p>
        <Link
          to="/#categories"
          className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold transition"
        >
          Explore Categories
        </Link>

        {/* <a
          href="/#categories"
          className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold transition"
        >
          Explore Categories
        </a> */}
      </section>
    </div>
  );
};

export default MyApproach;
