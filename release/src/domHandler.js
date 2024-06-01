"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementType = void 0;
const eventBus_1 = __importDefault(require("./Utility/eventBus"));
const utils_1 = require("./Utility/utils");
const types_1 = require("../types/types");
var ElementType;
(function (ElementType) {
    ElementType[ElementType["SCRIPT"] = 1] = "SCRIPT";
    ElementType[ElementType["STYLE"] = 2] = "STYLE";
})(ElementType || (exports.ElementType = ElementType = {}));
class DOMHandler {
    getScriptElement(scriptData) {
        const scriptTag = document.createElement("script");
        scriptTag.type = "text/javascript";
        Object.assign(scriptTag, scriptData.attributes || {});
        switch (true) {
            case utils_1.scriptMicroUtil.isExternalScriptTag(scriptData): {
                scriptTag.src = scriptData.src || "";
                break;
            }
            case utils_1.scriptMicroUtil.isInlineScriptTag(scriptData): {
                scriptTag.textContent =
                    scriptData.inlineCode || "/* No code provided! */";
                break;
            }
            default: {
            }
        }
        return scriptTag;
    }
    append(elementData, type, parentElementSel = "HEAD") {
        try {
            switch (type) {
                case ElementType.SCRIPT: {
                    const scriptTag = this.getScriptElement(elementData);
                    const parentElement = document.querySelector(parentElementSel) || document.body;
                    parentElement.append(scriptTag);
                    break;
                }
                default: {
                    break;
                }
            }
        }
        catch (e) {
            e.details = {
                when: "While appending script!",
                scriptConfigInfo: elementData
            };
            eventBus_1.default.trigger(types_1.EVENTS_ENUM.ERROR, e);
        }
    }
}
const domHandler = new DOMHandler();
exports.default = domHandler;
