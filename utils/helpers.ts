
// This file can be used for helper functions as the application grows.
// For now, it's a placeholder.

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-CA').format(date); // YYYY-MM-DD
};
