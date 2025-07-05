"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function GridWarp() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [0, window.innerHeight], [8, -8]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-8, 8]);

  const smoothX = useSpring(rotateX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute overflow-hidden inset-0 pointer-events-none z-0"
      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformStyle: "preserve-3d",
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{
        scale: [1, 0.8, 1],
        opacity: [1,1, 1],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.3)" // More visible
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </motion.div>
  );
}
