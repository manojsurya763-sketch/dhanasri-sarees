"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Welcome to Dhana Sri Sarees",
  "Free Shipping Across India on Order Above ₹5000",
  "Free International Shipping on Orders Above ₹50000",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#fff1df] text-maroon-900 text-center text-xs sm:text-sm py-2 px-4 tracking-wide">
      {MESSAGES[index]}
    </div>
  );
}
