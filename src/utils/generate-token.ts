import jwt from "jsonwebtoken";

const SECRET_KEY = "my_name_is_varun_kumar_9873538514"; // Use environment variable for security

export const generateToken = (
  payload: Record<string, unknown>,
  expiresIn = "1h"
): string => {
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not set in environment variables");
  }

  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};
