import { useCurrentUser } from './useCurrentUser';
import { useProgressStore } from '../stores/useProgressStore';

/**
 * Hook to determine whether the current user needs to pay.
 * Week 1 is free; after that, unpaid users see the upgrade screen.
 */
export function usePaywall() {
  const currentUser = useCurrentUser();
  const getProgress = useProgressStore(s => s.getProgress);
  const progress = currentUser ? getProgress(currentUser.id) : null;

  const isPaid = currentUser?.hasPaid === true;
  const currentWeek = progress?.currentWeek ?? 1;
  const isWeek1 = currentWeek <= 1;
  const needsPayment = !isPaid && !isWeek1;

  return { isPaid, isWeek1, needsPayment, currentWeek };
}
