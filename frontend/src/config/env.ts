const getEnv = (key: string): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const env = {
  API_BASE_URL: getEnv("VITE_API_BASE_URL"),
};
