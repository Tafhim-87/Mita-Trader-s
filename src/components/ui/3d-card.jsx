// components/ui/ThreeDCard.tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils"; // or your clsx/tailwind-merge helper

export const ThreeDCard = ({
  children,
  className,
  containerClassName,
  rotateDelta = 12,
  translateZ = 25,
}) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 40 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 40 });

  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = ((mouseY / rect.height) - 0.5) * -rotateDelta * 2;
    const rY = ((mouseX / rect.width) - 0.5) * rotateDelta * 2;

    rotateX.set(rX);
    rotateY.set(rY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className={cn(
        "relative h-full w-full rounded-2xl transition-shadow duration-300 hover:shadow-2xl",
        containerClassName
      )}
    >
      <motion.div
        style={{ transform: `translateZ(${translateZ + 10}px)` }}
        className={cn("h-full w-full", className)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};