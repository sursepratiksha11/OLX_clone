import { useEffect } from 'react';

export default function useLivePolling(callback, interval = 15000, deps = []) {
  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!active) return;
      await callback();
    };

    run();
    const timer = setInterval(run, interval);

    return () => {
      active = false;
      clearInterval(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
