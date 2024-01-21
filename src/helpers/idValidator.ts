import { isValidObjectId } from 'mongoose';

export function isValidObjectID(id: string): boolean {
  return isValidObjectId(id);
}