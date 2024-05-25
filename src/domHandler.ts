import { ScriptEntry } from "./types/types";

export enum ElementType {
    SCRIPT = 1,
    STYLE = 2
};

const scriptMicroUtil = {
    isExternalScriptTag: ({ src }: ScriptEntry) => !!src,
    isInlineScriptTag: ({ inlineCode }: ScriptEntry) => !!inlineCode
};

class DOMHandler {

   private getScriptElement(scriptData: ScriptEntry): HTMLElement {
       const scriptTag = document.createElement('script');
       scriptTag.type = "text/javascript";
       Object.assign(scriptTag, scriptData.attributes || {});
       switch (true) {
            case scriptMicroUtil.isExternalScriptTag(scriptData): {
                scriptTag.src = scriptData.src || "";
                break;
            }
            case scriptMicroUtil.isInlineScriptTag(scriptData): {
                scriptTag.textContent = scriptData.inlineCode || "/* No code provided! */";
                break;
            }
            default: {}
       }
       return scriptTag;
   }

   public append(elementData: ScriptEntry, type: ElementType, parentElementSel = 'HEAD') {
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
}

const domHandler = new DOMHandler();

export default domHandler;
