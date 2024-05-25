
/**
 * Checks if the provided element is either undefined, null, or NaN.
 * 
 * @param {unknown} element - The element to check.
 * @returns {boolean} - Returns true if the element is undefined, null, or NaN; otherwise, false.
 */
export const isElementNotDefined = (element: unknown): boolean => {
    const isUndefined = element === undefined;
    const isNull = element === null;
    const isNaN = Number.isNaN(element);
    return isUndefined || isNull || isNaN;
};

