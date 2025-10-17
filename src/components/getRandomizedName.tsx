export function getRandomizedName(prefix: string) {
    const random = Math.floor(Math.random() * Math.pow(16, 8))
        .toString(16)
        .padStart(8, "0");
    return `${prefix}${random}`;
}
