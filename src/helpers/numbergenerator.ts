import { v4 } from 'uuid';

export function generateAccountNumber() {
  const uuid = v4();
  const numericString = uuid.replace(/-/g, '').replace(/\D/g, ''); // Remove non-numeric characters
  return numericString.substring(0, 16);
}
