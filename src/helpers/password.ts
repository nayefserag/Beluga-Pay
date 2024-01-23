import * as bcrypt from 'bcrypt';

export class Password {
  public static async hashPassword(plainTextPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    return hashedPassword;
  }

  public static async Match(
    hashedPassword: string,
    plainTextPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(hashedPassword, plainTextPassword);
    return isMatch;
  }
}
