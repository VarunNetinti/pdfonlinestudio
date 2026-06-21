// ── AdSlot temporarily disabled ─────────────────────────────
// Uncomment the export below when ready to enable ads.

interface AdSlotProps {
  label?: string;
  height?: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AdSlot({ label, height, className }: AdSlotProps) {
  // Ad slots are currently disabled. Returning null removes all reserved
  // space and placeholder UI. Re-enable by restoring the full component.
  return null;
}
