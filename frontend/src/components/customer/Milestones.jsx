import React, { useState, useEffect, useRef } from "react";
import "./Milestones.css"; 
const Milestone = ({ number, label }) => (
  <div className="milestone-card">
    <h2 className="milestone-number">{number}+</h2>
    <p className="milestone-label">{label}</p>
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
          animateCount(3000, setServices);
          animateCount(5, setYears);
          animateCount(99, setClients);
          animateCount(99, setSatisfaction);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div className="milestones-wrapper" ref={sectionRef}>
      <Milestone number={services} label="Successful Services" />
      <Milestone number={years} label="Years in Business" />
      <Milestone number={clients} label="Happy Vendors" />
      <Milestone number={satisfaction} label="Client Satisfaction" />
    </div>
  );
};

export default Milestones;
