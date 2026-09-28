export const formatRelativeTime = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.round(diffMs / 1000);

  if (diffSeconds < 45) return 'just now';
  if (diffSeconds < 90) return '1 minute ago';

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 45) return `${diffMinutes} minutes ago`;
  if (diffMinutes < 90) return '1 hour ago';

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffHours < 42) return '1 day ago';

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 18) return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;

  const diffYears = Math.round(diffDays / 365);
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
};
