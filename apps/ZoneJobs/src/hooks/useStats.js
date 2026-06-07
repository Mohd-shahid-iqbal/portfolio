import { useState, useEffect } from "react";

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => {
        setStats({ totalJobs: 2500000, statesCount: 36, totalCompanies: 500 });
        setLoading(false);
      });
  }, []);

  return { stats, loading };
}
