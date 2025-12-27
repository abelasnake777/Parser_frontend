"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Gsap3DBox() {
const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cubeRef.current;
    if (!el) return;

    gsap.to(el, {
      rotateY: 360,
      rotateX: 360,
      rotateZ: 10,
      duration: 6,
      ease: "power1.inOut",
      repeat: -1,
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 via-black to-gray-900">
      <div className="perspective-1000">
        <div
          ref={cubeRef}
          className={`relative w-40 h-40 transform transition-transform duration-300
          [transform-style:preserve-3d]`}
        >
          {/* Cube Faces */}
          {[
            { side: "Front", color: "from-purple-500 to-pink-500", z: "translate-z-20" },
            { side: "Back", color: "from-blue-500 to-indigo-500", z: "-translate-z-20 rotate-y-180" },
            { side: "Left", color: "from-green-500 to-emerald-500", z: "-rotate-y-90 translate-z-20" },
            { side: "Right", color: "from-yellow-500 to-orange-500", z: "rotate-y-90 translate-z-20" },
            { side: "Top", color: "from-red-500 to-rose-500", z: "-rotate-x-90 translate-z-20" },
            { side: "Bottom", color: "from-sky-500 to-blue-600", z: "rotate-x-90 translate-z-20" },
          ].map((face, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex items-center justify-center text-white font-semibold text-lg
              bg-gradient-to-br ${face.color} shadow-xl shadow-black/40 rounded-xl
              ${face.z}`}
            >
              {face.side}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}