export const PORT: number = Number(process.env.PORT) || 5000;
export const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}
