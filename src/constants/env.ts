
const getEnvVar = (key: string) => {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is missing`);
    }
    return value;
};

export const env = {
    BASE_URL: getEnvVar("BASE_URL"),
    API_KEY: getEnvVar("BETTER_AUTH_SECRET"),
    DATABASE_URL: getEnvVar("DATABASE_URL"),
    RESEND: getEnvVar("RESEND"),
} as const;

export type EnvVariables = typeof env;

