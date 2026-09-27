// Real Firebase Auth (network calls) isn't used in tests — @/config/firebaseAdmin
// is mocked per test file to decode these fake tokens instead, keeping tests
// fast and offline. This never touches Prisma/Postgres, which stays real.
export function staffToken(firebaseUid: string) {
  return `staff:${firebaseUid}`;
}

export function customerToken(phone: string) {
  return `customer:${phone}`;
}

export function decodeFakeToken(token: string) {
  if (token.startsWith("staff:")) return { uid: token.slice("staff:".length) };
  if (token.startsWith("customer:")) {
    return { uid: `fake-${token.slice("customer:".length)}`, phone_number: token.slice("customer:".length) };
  }
  throw new Error(`Invalid fake token: ${token}`);
}
