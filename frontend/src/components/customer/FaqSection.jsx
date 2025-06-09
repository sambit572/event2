import React, { useState } from "react";
import "./FaqSection.css"; // CSS below

const faqData = [
  {
    question: "What services do you offer?",
    answer:
      "We offer web development, mobile app development, UI/UX design, and digital marketing solutions.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can contact us via the Contact page or email us at support@example.com.",
  },
  {
    question: "Do you provide custom solutions?",
    answer:
      "Yes, we provide fully customized solutions tailored to your business needs.",
  },
  {
    question: "What are your working hours?",
    answer: "Our team is available Monday to Friday, 9:00 AM to 6:00 PM IST.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faqContainer">
      <h2 className="faqTitle">Explore Our FAQs</h2>
      <div className="faqList">
        {faqData.map((faq, index) => (
          <div key={index} className="faqItem">
            <div className="faqQuestion" onClick={() => toggle(index)}>
              {faq.question}
              <span>{openIndex === index ? "-" : "+"}</span>
            </div>
            {openIndex === index && (
              <div className="faqAnswer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
