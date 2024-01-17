import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  accounts: [
    {
      bankName: String,
      accountNumber: String,
      balance : Number
    },
  ],
});
