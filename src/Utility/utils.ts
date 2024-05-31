import { ScriptEntry } from "../types/types";

/**
 * Checks if the provided element is either undefined, null, NaN, or an empty string.
 * 
 * @param {unknown} element - The element to check.
 * @returns {boolean} - Returns true if the element is undefined, null, or NaN; otherwise, false.
 */
export const isElementNotDefined = (element: unknown): boolean => {
    const isUndefined = element === undefined;
    const isNull = element === null;
    const isNaN = Number.isNaN(element);
    const isEmptyString = element === "";
    return isUndefined || isNull || isNaN || isEmptyString;
};

/**
 * Checks if the provided element is a defined string.
 *
 * @param {unknown} element - The element to check.
 * @returns {boolean} - Returns true if the element is a defined string; otherwise, false.
 */
export const isDefinedString = (element: unknown): element is string => !isElementNotDefined(element) && typeof element === "string";

/**
 * Checks if the provided element is a function.
 *
 * @param {unknown} element - The element to check.
 * @returns {boolean} - Returns true if the element is a function; otherwise, false.
 */
export const isFunction = (element: unknown): element is Function => !isElementNotDefined(element) && typeof element === "function";

/**
 * Converts a function to a string representation.
 *
 * @param {Function} element - The function to convert to a string.
 * @returns {string} - The string representation of the function.
 */
export const stringifyFunction = (element: Function): string => Function.prototype.toString.call(element);

/**
 * Converts the function to a string & wraps it over the template code.
 *
 * @param {Function} element - The function to wrap and convert.
 * @returns {string} - The string representation of the wrapped function.
 */
export const wrapFunctionOverTemplateCodeAndStringify = (element: Function): string => {
    const functionString = stringifyFunction(element);
    const functionCode = `(${functionString})()`;
    return functionCode;
}

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
    isExternalScriptTag: ({ src }: ScriptEntry) => !isElementNotDefined(src),

    /**
     * Checks if the script entry is an inline script tag.
     *
     * @param {ScriptEntry} scriptEntry - The script entry to check.
     * @returns {boolean} - Returns true if the script entry has an 'inlineCode' property; otherwise, false.
     */
    isInlineScriptTag: ({ inlineCode }: ScriptEntry) => !isElementNotDefined(inlineCode),

    wrapExternalScriptActionMethods: (scriptConfig: ScriptEntry, completionCallback: Function): void => {
        if (!scriptMicroUtil.isExternalScriptTag(scriptConfig)) {
            return;
        }
        scriptConfig.attributes = scriptConfig.attributes || {};
        // TODO: Fix the below type!
        const loadCb: any = scriptConfig.attributes.onload || (() => {});
        scriptConfig.attributes.onload = () => {
          loadCb?.();
          completionCallback();
        };
        const errorCb: any =
          scriptConfig.attributes.onerror || (() => {});
        scriptConfig.attributes.onerror = () => {
          errorCb?.();
          completionCallback();
        };
    }
};
