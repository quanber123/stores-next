import { intlFormat } from 'date-fns';
export const formatDate = (date: string | null) => {
  const result = date
    ? intlFormat(
        new Date(date),
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        {
          locale: 'en-Us',
        }
      )
    : '';
  return result;
};
export const formatTime = (date: string | null) => {
  const result = date
    ? intlFormat(
        new Date(date),
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
        {
          locale: 'en-Us',
        }
      )
    : '';
  return result;
};

export const hidePartialUsername = (username: string, visibleChars = 3) => {
  if (visibleChars >= username.length) {
    return username;
  } else {
    const hiddenChars = username.length - visibleChars - 1;
    const hiddenPart = '*'.repeat(hiddenChars);
    const visiblePart = username.slice(0, visibleChars);
    const lastChar = username.slice(-1);
    const hiddenUsername = visiblePart + hiddenPart + lastChar;
    return hiddenUsername;
  }
};

export function formatNumberWithDot(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
