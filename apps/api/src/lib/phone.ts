import { parsePhoneNumberFromString } from "libphonenumber-js";

import { env } from "./env";

export function normalizePhoneNumber(phoneNumber: string | null | undefined) {
  if (!phoneNumber) {
    return null;
  }

  const parsed = parsePhoneNumberFromString(phoneNumber, env.DEFAULT_REGION as never);

  if (!parsed || !parsed.isValid()) {
    return null;
  }

  return parsed.number;
}
