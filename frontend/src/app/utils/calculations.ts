export const calculateEstimatedDeadline = (
  targetAmount: number,
  savingAmount: number,
  schedule: 'daily' | 'weekly' | 'monthly'
): string => {
  if (savingAmount <= 0) return new Date().toISOString();
  const periods = Math.ceil(targetAmount / savingAmount);
  const date = new Date();
  if (schedule === 'daily') date.setDate(date.getDate() + periods);
  else if (schedule === 'weekly') date.setDate(date.getDate() + periods * 7);
  else date.setMonth(date.getMonth() + periods);
  return date.toISOString();
};

export const scheduleLabel = (schedule: 'daily' | 'weekly' | 'monthly'): string => {
  if (schedule === 'daily') return 'Hari';
  if (schedule === 'weekly') return 'Minggu';
  return 'Bulan';
};
