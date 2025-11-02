"use client";

import { useEffect, useRef, useState } from "react";

export default function LegoraSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "The sustainable fashion workspace built to redefine luxury. Darwaza adapts to your style preferences, unlocking ethical and beautiful fashion at scale.";
  const sectionRef = useRef<HTMLElement>(null);
  const typingSpeed = 50; // milliseconds per character

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!isVisible) return;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [isVisible, fullText]);

  return (
    <section 
      ref={sectionRef}
      className="mt-15 mb-15 py-16 px-4 flex flex-col md:flex-row items-center justify-center gap-12 "
    >
      <div 
        className={`transition-all duration-1000 transform ${
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-20"
        } md:w-1/3 max-w-md`}
      >
        <p className="text-base md:text-lg leading-relaxed text-accent">
          {typedText}
          <span className={isVisible && typedText.length < fullText.length ? "animate-pulse" : "opacity-0"}>|</span>
        </p>
      </div>
      
      <div 
        className={`transition-all duration-1000 delay-300 transform ${
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-20"
        } md:w-2/3 text-right`}
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-accent leading-tight">
          Darwaza meets fashion<br />
          where it matters.
        </h2>
      </div>
    </section>
  );
}