// Unit conversion utilities

export const convertMlToOz = (ml: number): number => {
  return Math.round((ml * 0.033814) * 10) / 10;
};

export const convertOzToMl = (oz: number): number => {
  return Math.round((oz * 29.5735) * 10) / 10;
};

export const normalizeVolume = (amount: string | number, unit?: 'ml' | 'oz'): { value: number; unit: 'oz' } => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return { value: 0, unit: 'oz' };
  }
  
  // If no unit specified, try to guess from the value
  if (!unit) {
    // Values > 50 are likely ml, values <= 50 are likely oz
    unit = numericAmount > 50 ? 'ml' : 'oz';
  }
  
  if (unit === 'ml') {
    return { value: convertMlToOz(numericAmount), unit: 'oz' };
  }
  
  return { value: numericAmount, unit: 'oz' };
};

export const formatVolume = (oz: number): string => {
  return `${oz} oz`;
};

export const formatVolumeUnit = (unit: "ml" | "oz"): string => {
  return unit === "ml" ? "ml" : "oz";
};