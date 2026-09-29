import React from 'react';

export default function SentimentBadge({ sentiment = 'Neutral' }) {
  const s = sentiment ? sentiment.toLowerCase() : 'neutral';

  let typeClass = 'neutral';
  let icon = '😐';
  let label = 'Neutral';

  if (s.includes('positive') || s.includes('patient') || s.includes('happy')) {
    typeClass = 'positive';
    icon = '😊';
    label = 'Positive';
  } else if (s.includes('frustrated') || s.includes('angry') || s.includes('urgent') || s.includes('negative')) {
    typeClass = 'frustrated';
    icon = '⚠️';
    label = 'Frustrated';
  }

  return (
    <span className={`sentiment-badge ${typeClass}`} id="customer-sentiment-badge">
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
