export const PORT: number = Number(process.env.PORT) || 5000;
export const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

export const ADMIN_EMAIL: string = process.env.ADMIN_EMAIL as string;
export const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD as string;
export const JWT_SECRET: string = process.env.JWT_SECRET as string;
