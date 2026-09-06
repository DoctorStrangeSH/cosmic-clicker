export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  
  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const unitIndex = Math.floor(Math.log10(num) / 3);
  
  if (unitIndex >= units.length) {
    return num.toExponential(2);
  }
  
  const scaledNum = num / Math.pow(10, unitIndex * 3);
  return `${scaledNum.toFixed(2)}${units[unitIndex]}`;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м ${secs}с`;
  }
  if (minutes > 0) {
    return `${minutes}м ${secs}с`;
  }
  return `${secs}с`;
}

export function formatPercent(percent: number): string {
  return `${(percent * 100).toFixed(1)}%`;
}