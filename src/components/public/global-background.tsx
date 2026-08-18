/**
 * GlobalBackground — subtle animated background that spans the entire public website.
 *
 * Design:
 * - 3 slow-drifting gradient blobs (brand colors: #175bea blue, #00c5fb cyan, #030f2b dark)
 * - Subtle grid pattern overlay
 * - Very low opacity (5-8%) so content readability is never affected
 * - Fixed position (stays in place during scroll for parallax effect)
 * - pointer-events: none (doesn't interfere with clicks/form inputs)
 * - GPU-friendly: only uses CSS transform (translate + scale) + opacity
 *
 * Performance:
 * - No JavaScript, no canvas, no requestAnimationFrame
 * - Pure CSS animations (transform-based = GPU-accelerated)
 * - Only 3 DOM elements (blobs) + 1 grid div
 * - Reduced intensity on mobile (smaller blob sizes)
 *
 * Accessibility:
 * - aria-hidden="true" (decorative, not for screen readers)
 * - prefers-reduced-motion: animations fully disabled via CSS
 */
export function GlobalBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base background color (theme-aware) */}
      <div className="absolute inset-0 bg-background" />

      {/* Blob 1 — Blue (#175bea), top-left quadrant */}
      <div
        className="global-blob-1 absolute -left-[10%] -top-[10%] h-[50vh] w-[50vh] rounded-full opacity-[0.08] blur-[80px] sm:opacity-[0.1]"
        style={{ background: 'radial-gradient(circle, #175bea 0%, transparent 70%)' }}
      />

      {/* Blob 2 — Cyan (#00c5fb), right-center */}
      <div
        className="global-blob-2 absolute top-[30%] -right-[10%] h-[45vh] w-[45vh] rounded-full opacity-[0.08] blur-[80px] sm:opacity-[0.1]"
        style={{ background: 'radial-gradient(circle, #00c5fb 0%, transparent 70%)' }}
      />

      {/* Blob 3 — Dark blue (#030f2b), bottom-center */}
      <div
        className="global-blob-3 absolute -bottom-[10%] left-[20%] h-[40vh] w-[40vh] rounded-full opacity-[0.05] blur-[80px] sm:opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #030f2b 0%, transparent 70%)' }}
      />

      {/* Subtle grid overlay — static (blobs moving over it create the motion effect) */}
      <div className="absolute inset-0 bg-grid-subtle opacity-[0.12]" />
    </div>
  );
}
