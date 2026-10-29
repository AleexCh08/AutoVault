export function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function addMonthsISO(dateStr, months) {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1 + Number(months), parts[2]);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function daysUntil(dateStr) {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date(todayISO() + "T00:00:00");
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function formatNumber(n) {
  return Number(n).toLocaleString("es-VE", { maximumFractionDigits: 1 });
}