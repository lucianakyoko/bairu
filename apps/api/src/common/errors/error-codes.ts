export const ErrorCode = {
  COMPANY_USERNAME_ALREADY_IN_USE: "COMPANY_USERNAME_ALREADY_IN_USE",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
