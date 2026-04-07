exports.calculateCharges = (experience_years, time_slot) => {
  const baseRate = 200; // ₹200 base
  const experienceBonus = experience_years * 50; // ₹50 per year
  const duration = getDurationHours(time_slot); // e.g., 2 hours → ₹ per hour

  return baseRate + experienceBonus + (duration * 100);
};

function getDurationHours(time_slot) {
  const [start, end] = time_slot.split('-');
  const [startH] = start.split(':').map(Number);
  const [endH] = end.split(':').map(Number);
  return Math.max(endH - startH, 1); // fallback 1hr
}
