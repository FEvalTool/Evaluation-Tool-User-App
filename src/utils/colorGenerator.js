/**
 * Generates a visually distinct color using HSL.
 * @param {string} str The input string.
 * @returns {string} An hsl() color string.
 */
export const stringToColour = (str) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        // We use a slightly more "aggressive" multiplier to spread the hash
        hash = (hash << 5) + hash + str.codePointAt(i);
    }

    // 1. Calculate Hue (0 - 360)
    // Using absolute value to avoid negative degrees
    const h = Math.abs(hash * 137) % 360;

    // 2. Fix Saturation and Lightness
    // SATURATION: 60% (Rich, but not "neon")
    // LIGHTNESS: 40% (Deep enough to make white text highly readable)
    const s = 60;
    const l = 40;

    return `hsl(${h}, ${s}%, ${l}%)`;
};
