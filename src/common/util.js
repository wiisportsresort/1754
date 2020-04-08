/**
 * Captializes the first letter in the string.
 * Does not capitalize every word in the string.
 * @param {string} string - string to captialize.
 */
export const capitalize = (string) => string[0].toUpperCase() + string.slice(1);
