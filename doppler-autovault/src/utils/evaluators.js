import { addMonthsISO, daysUntil } from './helpers';

export function evaluateMaintenance(item, currentOdo) {
  const kmElapsed = Math.max(0, currentOdo - Number(item.lastKm));
  const nextKm = Number(item.lastKm) + Number(item.intervalKm);
  const kmRemaining = nextKm - currentOdo;
  const ratioKm = Math.min(100, Math.max(0, (kmElapsed / Number(item.intervalKm)) * 100));

  const dueDate = addMonthsISO(item.lastDate, Number(item.intervalMonths));
  const daysLeft = daysUntil(dueDate);

  let status = "ok";
  let label = "AL DÍA";
  if (kmRemaining <= 0 || daysLeft <= 0) {
    status = "due";
    label = "VENCIDO";
  } else if (ratioKm >= 80 || daysLeft <= 30) {
    status = "warn";
    label = "PRÓXIMO";
  }

  return { kmElapsed, nextKm, kmRemaining, ratioKm, dueDate, daysLeft, status, label };
}

export function evaluateDocument(doc) {
  const daysLeft = daysUntil(doc.expiryDate);
  let status = "ok";
  let label = `${daysLeft} DÍAS RESTANTES`;
  if (daysLeft < 0) {
    status = "due";
    label = `VENCIDO HACE ${Math.abs(daysLeft)} DÍAS`;
  } else if (daysLeft <= 30) {
    status = "warn";
    label = `VENCE EN ${daysLeft} DÍAS`;
  }
  return { daysLeft, status, label };
}