import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return show ? (
    <button
      onClick={scrollToTop}
      className="hidden xl:flex fixed bottom-[150px] right-[32px] z-10 bg-[#f3c12d] hover:bg-[#ba79ff] text-black px-6 py-3 hover:text-black shadow-lg transition-all duration-300 hover:scale-105 items-center gap-2 text-sm font-semibold"
      style={{
        borderRadius: "30px 30px 0px 30px",
        fontSize: "15px",
        fontWeight: "bold",
      }}
    >
      <FaArrowUp size={30} />
    </button>
  ) : null;
};

export default BackToTop;
