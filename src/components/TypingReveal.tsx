import React, { useState, useEffect, useRef } from "react";

interface TypingRevealProps {
  text: string;
  speed?: number; // ms per step
  delay?: number; // ms before start
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  mode?: "character" | "word";
  showCursor?: boolean;
}

export const TypingReveal: React.FC<TypingRevealProps> = ({
  text,
  speed = 18,
  delay = 50,
  as: Component = "span",
  className = "",
  mode = "character",
  showCursor = false,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayedText(text);
      setIsCompleted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          const timer = setTimeout(() => {
            setIsStarted(true);
          }, delay);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [delay, text]);

  useEffect(() => {
    if (!isStarted || isCompleted) return;

    if (mode === "word") {
      const words = text.split(" ");
      let currentWordIndex = 0;

      const interval = setInterval(() => {
        currentWordIndex++;
        setDisplayedText(words.slice(0, currentWordIndex).join(" "));
        if (currentWordIndex >= words.length) {
          clearInterval(interval);
          setIsCompleted(true);
        }
      }, Math.max(25, speed * 2.5));

      return () => clearInterval(interval);
    } else {
      let index = 0;
      const interval = setInterval(() => {
        index++;
        setDisplayedText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setIsCompleted(true);
        }
      }, Math.max(12, speed));

      return () => clearInterval(interval);
    }
  }, [isStarted, isCompleted, text, speed, mode]);

  return (
    // @ts-expect-error dynamic component type
    <Component ref={containerRef} className={className}>
      {isCompleted ? text : displayedText}
      {!isCompleted && isStarted && showCursor && (
        <span
          className="inline-block w-0.5 h-[1.1em] ml-0.5 align-middle bg-teal-600 animate-pulse"
          aria-hidden="true"
        />
      )}
    </Component>
  );
};
