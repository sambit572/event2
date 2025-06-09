import "./FaqSection.css";

import React, { useState } from "react";

const faqData = [
  {
    question: "What is Eventsbridge?",
    answer:
      "Eventsbridge is a seamless and intuitive platform designed to connect event planners, hosts, and customers with reliable vendors offering services like decorations, DJ entertainment, lighting, and more. Our goal is to simplify your event planning by providing easy access to trusted vendors in one place.",
  },
  {
    question: "How do I book a vendor on Eventsbridge?",
    answer:
      "Booking is quick and straightforward. Choose your event type and date, browse vendors’ profiles, check their availability, ratings, and reviews, then select the one that fits your needs. Complete the booking by making a secure payment on the platform.",
  },
  {
    question: "Can I book multiple vendors for the same event?",
    answer:
      "Yes! Eventsbridge allows you to book as many vendors as you need for a single event. Whether it’s DJs, decorators, caterers, or photographers, you can manage all bookings conveniently through your dashboard.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We support a variety of secure payment methods, including credit/debit cards, UPI, digital wallets, and net banking. All payments are encrypted to protect your personal and financial information.",
  },
  {
    question: "Can I communicate with the vendor before the event?",
    answer:
      "Yes, after booking, you can directly communicate with vendors through the platform’s chat or call features to clarify requirements, discuss event details, and coordinate effectively.",
  },
  {
    question: "What happens if I need to cancel or reschedule?",
    answer:
      "You can cancel or reschedule your booking up to 7days before the event. For cancellations or changes, please contact customer support or manage your bookings via the platform dashboard.",
  },
  {
    question: "How do I know if a vendor is available on my event date?",
    answer:
      "Vendors update their availability calendars in real-time on Eventsbridge, so you can easily check if they’re free on your preferred date before booking.",
  },
  {
    question: "Is Eventsbridge only available in certain cities?",
    answer:
      "Currently, Eventsbridge is providing services exclusively in Odisha. However, we are actively working on expanding our platform to more cities and regions soon to serve a wider audience. Stay tuned for updates!",
  },
  {
    question: "Is Eventsbridge only available in certain cities?",
    answer:
      "Currently, Eventsbridge is providing services exclusively in Odisha, with plans to expand soon.",
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleAnswer = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  // Split into 3 columns
  const columnCount = 3;
  const columns = Array.from({ length: columnCount }, (_, colIndex) =>
    faqData.filter((_, i) => i % columnCount === colIndex)
  );
  return (
    <div className="faq-container">
      <h2 className="faq-title">Explore Our FAQs </h2>
      <div className="faq-columns">
        {columns.map((column, colIdxs) => (
          <div key={colIdxs} className="faq-column">
            {column.map((item, index) => {
              const itemIndex = colIdxs + index * columnCount;
              return (
                <div
                  key={itemIndex}
                  className={`faq-item ${
                    activeIndex === itemIndex ? "active" : ""
                  }`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleAnswer(itemIndex)}
                  >
                    {item.question}
                    <span className="faq-icon">
                      {activeIndex === itemIndex ? "−" : "+"}
                    </span>
                  </button>
                  {activeIndex === itemIndex && (
                    <div className="faq-answer">{item.answer}</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
