import { Types, isValidObjectId } from 'mongoose';

export function isValidObjectID(id: string): boolean {
  return isValidObjectId(id);
}

export function constructObjId(id: string | Types.ObjectId) {
  return new Types.ObjectId(id);
}
