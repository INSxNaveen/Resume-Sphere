import { useEffect, useState } from 'react';

const getPerformanceProfile = () => {
  if (typeof window === 'undefined') {
    return {
      isLowPerformance: false,
      canUsePointerEffects: false,
    };
  }

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const deviceMemory = navigator.deviceMemory ?? 8;
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const saveData = navigator.connection?.saveData ?? false;

  return {
    isLowPerformance:
      reducedMotion ||
      saveData ||
      coarsePointer ||
      deviceMemory <= 4 ||
      hardwareConcurrency <= 4,
    canUsePointerEffects: !coarsePointer && !reducedMotion,
  };
};

export default function usePerformanceMode() {
  const [profile, setProfile] = useState(() => getPerformanceProfile());
  const [shouldEnableEnhancements, setShouldEnableEnhancements] = useState(false);

  useEffect(() => {
    const nextProfile = getPerformanceProfile();
    setProfile(nextProfile);

    if (nextProfile.isLowPerformance) {
      setShouldEnableEnhancements(false);
      return undefined;
    }

    const enableEnhancements = () => setShouldEnableEnhancements(true);
    const handle =
      window.requestIdleCallback?.(enableEnhancements, { timeout: 1200 }) ??
      window.setTimeout(enableEnhancements, 500);

    return () => {
      if (window.cancelIdleCallback && typeof handle === 'number') {
        window.cancelIdleCallback(handle);
        return;
      }

      window.clearTimeout(handle);
    };
  }, []);

  return {
    ...profile,
    shouldEnableEnhancements,
  };
}
