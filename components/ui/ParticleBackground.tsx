"use client";

import React from "react";

export function ParticleBackground() {
  const [particles, setParticles] = React.useState<Array<{
    id: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
  }>>([]);

  // Generate particles only on client side to avoid hydration mismatch
  React.useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 4 + 2, // 2-6px
        delay: Math.random() * 12, // 0-12s (40% faster)
        duration: Math.random() * 6 + 9, // 9-15s (40% faster)
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark blue space background */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-blue-dark via-space-blue to-space-blue-darker" />
      
      {/* Floating fire sparks */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle-spark absolute rounded-full animate-float-spark"
          style={{
            left: `${particle.left}%`,
            bottom: '0',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-space-blue-darker/50 via-transparent to-transparent" />
    </div>
  );
}
