export const ADMIN_ORDER_STATUSES = [
  'PLACED',
  'CONFIRMED',
  'PREPARING',
  'OUT_FOR_DELIVERY'
];

export const ORDER_STATUSES = [
  ...ADMIN_ORDER_STATUSES,
  'DELIVERED'
];

export const ALL_STATUSES = [
  ...ORDER_STATUSES,
  'CANCELLED'
];

export function getNextStatus(currentStatus) {
  const currentIndex = ADMIN_ORDER_STATUSES.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= ADMIN_ORDER_STATUSES.length - 1) {
    return null;
  }
  return ADMIN_ORDER_STATUSES[currentIndex + 1];
}

export function canCancelOrder(currentStatus) {
  return currentStatus === 'PLACED' || currentStatus === 'CONFIRMED';
}
