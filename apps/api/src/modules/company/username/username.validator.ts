const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const USERNAME_PATTERN = /^[a-z0-9_-]+$/;

export function validateUsername(username: string): boolean {
  if (
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH
  ) {
    return false;
  }

  if (!USERNAME_PATTERN.test(username)) {
    return false;
  }

  if (username.startsWith("_") || username.startsWith("-")) {
    return false;
  }

  if (username.endsWith("_") || username.endsWith("-")) {
    return false;
  }

  return true;
}
