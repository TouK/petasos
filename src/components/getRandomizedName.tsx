export function getRandomizedName(prefix: string) {
  const random = Math.round(100000 * Math.random());
  return `${prefix}${random}`;
}
