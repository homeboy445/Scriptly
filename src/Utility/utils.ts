import { ScriptEntry } from "../types/types";

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

/**
 * Utility functions related to script tags.
 */
export const scriptMicroUtil = {
    /**
     * Checks if the script entry is an external script tag.
     *
     * @param {ScriptEntry} scriptEntry - The script entry to check.
     * @returns {boolean} - Returns true if the script entry has a 'src' property; otherwise, false.
     */
    isExternalScriptTag: ({ src }: ScriptEntry) => !!src,

    /**
     * Checks if the script entry is an inline script tag.
     *
     * @param {ScriptEntry} scriptEntry - The script entry to check.
     * @returns {boolean} - Returns true if the script entry has an 'inlineCode' property; otherwise, false.
     */
    isInlineScriptTag: ({ inlineCode }: ScriptEntry) => !!inlineCode
};
