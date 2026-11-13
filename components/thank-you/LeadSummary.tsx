'use client';

import { useEffect, useState } from 'react';

/** The visitor's answers as chips, handed over from the qualifier through sessionStorage. */
export default function LeadSummary() {
  const [labels, setLabels] = useState<string[]>([]);
  useEffect(() => {
    try {
      const lead = JSON.parse(sessionStorage.getItem('wft_lead') || 'null') as { labels?: unknown } | null;
      if (lead && Array.isArray(lead.labels)) setLabels(lead.labels.filter((l): l is string => typeof l === 'string'));
    } catch { /* storage blocked or empty: no chips */ }
  }, []);
  return (
    <div className="summary" data-summary="">
      {labels.map((l) => <span key={l}>{l}</span>)}
    </div>
  );
}
