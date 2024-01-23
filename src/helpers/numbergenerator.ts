import { v4 as uuidv4 } from 'uuid';

export function generator(type: string): string {
  const uuid = uuidv4().replace(/-/g, '');
  const numericOnly = uuid.replace(/\D/g, ''); // Remove non-numeric characters
  const shuffle = numericOnly
    .split('')
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join('');

  if (type === 'Account Number') {
    return shuffle.substring(0, 16);
  }

  return shuffle;
}
