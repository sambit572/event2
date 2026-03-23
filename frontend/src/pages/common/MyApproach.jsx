import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: i * 0.2,
    },
  }),
};
const MyApproach = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full text-black-900 ">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our Approach at EventsBridge
        </h1>
        <p className=" text-lg md:text-xl max-w-2xl mx-auto">
          Connecting customers with trusted event vendors through a seamless,
          transparent, and smart booking experience.
        </p>
      </section>

      {/* 3-STEP PROCESS */}
      <section className="max-w-6xl mx-auto px-6 mb-4">
        {/* Heading */}
        <div className="flex justify-center mb-[-15px]">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="
            mb-10
            bg-[#f3c12d]
            text-[#001f3f]
            px-5 py-1
            text-center text-[1.5rem] font-bold
            w-fit
            border-[6px] border-double border-[#001f3f]
            rounded-[30px_10px_30px_10px]
            inline-block
            shadow-[0_8px_20px_rgba(0,0,0,0.3)]
            tracking-wider
            uppercase
            transition-transform duration-300 ease-in-out
          "
          >
            How It Works
          </motion.h1>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "1. Discover",
              desc: "Customers explore categories, compare vendors, view portfolios, and read authentic reviews before booking.",
            },
            {
              title: "2. Connect",
              desc: "Vendors receive customer inquiries instantly and respond with pricing, availability, and service details.",
            },
            {
              title: "3. Book & Manage",
              desc: "Customers finalize bookings and vendors manage schedules easily all from within EventsBridge.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="p-6 bg-[#141a28] rounded-xl border border-gray-700 shadow-[0_6px_20px_rgba(0,0,0,0.35)]
                      hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]
                      hover:scale-[1.03] transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CUSTOMER APPROACH */}
      <section className="text-black-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* <h2 className="text-3xl font-bold mb-6">
            Our Approach for Customers
          </h2> */}
          <div className="flex justify-center mb-[-15px]">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="
            mb-10
      bg-[#f3c12d]
      
      px-5 py-1
      text-center text-[1.5rem] font-bold
      w-fit
      border-[6px] border-double border-[#001f3f]
      rounded-[30px_10px_30px_10px]
      inline-block
      shadow-[0_8px_20px_rgba(0,0,0,0.1)]
      tracking-wider
      uppercase
      transition-transform duration-300 ease-in-out
    "
            >
              Our Approach for Customers
            </motion.h1>
          </div>
          <p className="text-black mb-6">
            At EventsBridge, we focus on making event planning smooth and
            worry-free. Whether it's a wedding, party, corporate event, or
            festival — we help you find the right vendor at the right price.
          </p>

          <ul className="space-y-3 text-black font-semibold">
            <li>
              <span class="text-green-500">✔</span> Verified and trusted vendors
            </li>
            <li>
              <span class="text-green-500">✔</span> Transparent pricing and easy
              comparisons
            </li>
            <li>
              <span class="text-green-500">✔</span> Real reviews from real
              customers
            </li>
            <li>
              <span class="text-green-500">✔</span> Instant booking and chat
              with vendors
            </li>
            <li>
              <span class="text-green-500">✔</span> No hidden fees — everything
              upfront
            </li>
          </ul>
        </div>
      </section>

      {/* VENDOR APPROACH */}
      <section className="pt-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* <h2 className="text-3xl font-bold mb-6">Our Approach for Vendors</h2> */}
          <div className="flex justify-center mb-[-15px]">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="
            mb-10
      bg-[#f3c12d]
      text-[#001f3f]
      px-5 py-1
      text-center text-[1.5rem] font-bold
      w-fit
      border-[6px] border-double border-[#001f3f]
      rounded-[30px_10px_30px_10px]
      inline-block
      shadow-[0_8px_20px_rgba(0,0,0,0.1)]
      tracking-wider
      uppercase
      transition-transform duration-300 ease-in-out
    "
            >
              Our Approach for Vendors
            </motion.h1>
          </div>
          <p className=" mb-6">
            Vendors are the backbone of EventsBridge. We help them grow their
            business by providing exposure, tools, and a reliable customer flow.
          </p>

          <ul className="space-y-3 font-semibold">
            <li>
              <span class="text-green-500">✔</span> Genuine customer leads — no
              spam
            </li>
            <li>
              <span class="text-green-500">✔</span> Smart scheduling & booking
              management
            </li>
            <li>
              <span class="text-green-500">✔</span> Online portfolio to showcase
              services
            </li>
            <li>
              <span class="text-green-500">✔</span> Review system to build trust
            </li>
            <li>
              <span class="text-green-500">✔</span> Analytics to understand
              performance
            </li>
          </ul>
        </div>
      </section>

      {/* WHY EVENTSBRIDGE WORKS */}

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Heading */}
          <div className="flex justify-center mb-[-15px]">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="
              mb-10
              bg-[#f3c12d]
              text-[#001f3f]
              px-5 py-1
              text-center text-[1.5rem] font-bold
              w-fit
              border-[6px] border-double border-[#001f3f]
              rounded-[30px_10px_30px_10px]
              inline-block
              shadow-[0_8px_20px_rgba(0,0,0,0.3)]
              tracking-wider
              uppercase
              transition-transform duration-300 ease-in-out
            "
            >
              Why EventsBridge Works ?
            </motion.h1>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8 text-gray-300">
            {[
              {
                title: "Trust",
                desc: "Verified vendors, secure bookings, and real reviews.",
              },
              {
                title: "Transparency",
                desc: "No hidden costs; everything is shown upfront.",
              },
              {
                title: "Seamless Process",
                desc: "From choosing to booking everything happens effortlessly.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="
                p-6 bg-[#141a28] rounded-xl border border-gray-700
                shadow-[0_6px_20px_rgba(0,0,0,0.35)]
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]
                hover:scale-[1.03]
                transition-all duration-300
              "
              >
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Event ?</h2>
        <p className=" mb-6">
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
