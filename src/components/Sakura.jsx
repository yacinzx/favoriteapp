import { useMemo } from "react";

const PETAL_COUNT = 16;

/**
 * Floating sakura petals for ambient anime atmosphere.
 * Pure CSS animation — positions and timing are randomized once per mount.
 */
function Sakura() {
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => {
        // Deterministic pseudo-random spread so SSR/renders stay stable.
        const n = (i * 37) % 100;
        return {
          left: (i * 6.1 + (n % 7)) % 100,
          delay: ((i * 1.9) % 13).toFixed(2),
          duration: 11 + ((i * 3.7) % 9),
          scale: 0.55 + ((i * 0.17) % 0.6),
          drift: -28 + ((i * 11) % 56),
          opacity: 0.22 + ((i * 0.09) % 0.4),
        };
      }),
    [],
  );

  return (
    <div className="sakura" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--petal-opacity": p.opacity.toFixed(2),
            "--drift": `${p.drift}px`,
            "--scale": p.scale,
          }}
        />
      ))}
    </div>
  );
}

export default Sakura;
