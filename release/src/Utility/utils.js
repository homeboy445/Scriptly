"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptMicroUtil = exports.wrapFunctionOverTemplateCodeAndStringify = exports.stringifyFunction = exports.isFunction = exports.isDefinedString = exports.removeUndefinedKeys = exports.isElementNotDefined = void 0;
/**
 * Checks if the provided element is either undefined, null, NaN, or an empty string.
 *
 * @param {unknown} element - The element to check.
 * @returns {boolean} - Returns true if the element is undefined, null, or NaN; otherwise, false.
 */
const isElementNotDefined = (element) => {
    const isUndefined = element === undefined;
    const isNull = element === null;
    const isNaN = Number.isNaN(element);
    const isEmptyString = element === "";
    return isUndefined || isNull || isNaN || isEmptyString;
};
exports.isElementNotDefined = isElementNotDefined;
/**
 * Removes undefined keys from the provided object.
 *
 * @param {object} obj - The object to remove undefined keys from.
 * @returns {object} - The object with undefined keys removed.
 */
const removeUndefinedKeys = (targetObj) => {
    const obj = Object.assign({}, targetObj);
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
    return obj;
};
exports.removeUndefinedKeys = removeUndefinedKeys;
/**
 * Checks if the provided element is a defined string.
 *
 * @param {unknown} element - The element to check.
 * @returns {boolean} - Returns true if the element is a defined string; otherwise, false.
 */
const isDefinedString = (element) => !(0, exports.isElementNotDefined)(element) && typeof element === "string";
exports.isDefinedString = isDefinedString;
/**
 * Checks if the provided element is a function.
 *
 * @param {unknown} element - The element to check.
 * @returns {boolean} - Returns true if the element is a function; otherwise, false.
 */
const isFunction = (element) => !(0, exports.isElementNotDefined)(element) && typeof element === "function";
exports.isFunction = isFunction;
/**
 * Converts a function to a string representation.
 *
 * @param {Function} element - The function to convert to a string.
 * @returns {string} - The string representation of the function.
 */
const stringifyFunction = (element) => Function.prototype.toString.call(element);
exports.stringifyFunction = stringifyFunction;
/**
 * Converts the function to a string & wraps it over the template code.
 *
 * @param {Function} element - The function to wrap and convert.
 * @returns {string} - The string representation of the wrapped function.
 */
const wrapFunctionOverTemplateCodeAndStringify = (element) => {
    const functionString = (0, exports.stringifyFunction)(element);
    const functionCode = `(${functionString})()`;
    return functionCode;
};
exports.wrapFunctionOverTemplateCodeAndStringify = wrapFunctionOverTemplateCodeAndStringify;
/**
 * Utility functions related to script tags.
 */
exports.scriptMicroUtil = {
    /**
     * Checks if the script entry is an external script tag.
     *
     * @param {ScriptEntry} scriptEntry - The script entry to check.
     * @returns {boolean} - Returns true if the script entry has a 'src' property; otherwise, false.
     */
    isExternalScriptTag: ({ src }) => !(0, exports.isElementNotDefined)(src),
    /**
     * Checks if the script entry is an inline script tag.
     *
     * @param {ScriptEntry} scriptEntry - The script entry to check.
     * @returns {boolean} - Returns true if the script entry has an 'inlineCode' property; otherwise, false.
     */
    isInlineScriptTag: ({ inlineCode }) => !(0, exports.isElementNotDefined)(inlineCode),
    wrapExternalScriptActionMethods: (scriptConfig, completionCallback) => {
        if (!exports.scriptMicroUtil.isExternalScriptTag(scriptConfig)) {
            return;
        }
        scriptConfig.attributes = scriptConfig.attributes || {};
        // TODO: Fix the below type!
        const loadCb = scriptConfig.attributes.onload || (() => { });
        scriptConfig.attributes.onload = () => {
            loadCb === null || loadCb === void 0 ? void 0 : loadCb();
            completionCallback();
        };
        const errorCb = scriptConfig.attributes.onerror || (() => { });
        scriptConfig.attributes.onerror = () => {
            errorCb === null || errorCb === void 0 ? void 0 : errorCb();
            completionCallback();
        };
    }
};
