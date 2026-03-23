import React, { useState, useEffect, useRef } from "react";

const Milestone = ({ number, label }) => (
  <div className="flex-1 min-w-[160px] text-center p-6 bg-white/30 rounded-xl backdrop-blur-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
    <h2 className="text-4xl font-extrabold text-[#001f3f] mb-2 transition-colors duration-300">
      {number}+
    </h2>
    <p className="uppercase font-semibold text-[#001f3f] tracking-wide text-base transition-colors duration-300">
      {label}
    </p>
  </div>
);


const Milestones = () => {
  const [services, setServices] = useState(0);
  const [years, setYears] = useState(0);
  const [clients, setClients] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const animateCount = (target, setter) => {
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(interval);
        current = target;
      }
      setter(Math.floor(current));
    }, duration / steps);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount(100, setServices);
          animateCount(1, setYears);
          animateCount(50, setClients);
          animateCount(50, setSatisfaction);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[400px] py-20 px-6 mt-10 flex flex-wrap justify-center items-center gap-8 rounded-xl overflow-hidden bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/milestome.webp')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/70 to-yellow-100/70 -z-10"></div>

      {/* Milestone cards */}
      <Milestone number={services} label="Successful Services" />
      <Milestone number={years} label="Years in Business" />
      <Milestone number={clients} label="Happy Vendors" />
      <Milestone number={satisfaction} label="Client Satisfaction" />
    </section>
  );
};

export default Milestones;
