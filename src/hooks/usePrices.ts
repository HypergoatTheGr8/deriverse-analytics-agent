import { useEffect, useRef, useState } from 'react';

export function usePrices(pollInterval = 15000) {
  const [prices, setPrices] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let timer: any;

    const fetchOnce = async () => {
      try {
        const res = await fetch('/api/prices');
        if (!res.ok) throw new Error('Failed to fetch prices');
        const json = await res.json();
        if (mounted.current) setPrices(json.prices || null);
      } catch (e) {
        // swallow; caller can decide fallback
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    fetchOnce();
    timer = setInterval(fetchOnce, pollInterval);
    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [pollInterval]);

  return { prices, loading } as const;
}
