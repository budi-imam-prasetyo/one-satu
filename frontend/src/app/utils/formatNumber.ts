export const formatThousand = (val: string): string => {
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseThousand = (val: string): number => {
  return Number(val.replace(/\./g, ''));
};

export const formatRupiah = (num: number): string =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(num);

export const formatRupiahFull = (num: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
