export const RESERVED_SLUGS = [
  "admin",
  "api",
  "dashboard",
  "create",
  "analytics",
  "home",
  "login",
  "signup",
];

export function isReserved(slug: string) {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}