export function isBot(userAgent: string) {
  if (!userAgent) return false;
  return /bot|crawl|spider/i.test(userAgent);
}