import { isElementNotDefined } from "./Utility/utils";
import domHandler, { ElementType } from "./domHandler";
import { GenericObject, LoadPriority, ScriptEntry, ScriptStore } from "./types/types";

class ScriptHandler {
  scriptStore: ScriptStore = [];

  private addScriptConfig(scriptConfig: ScriptEntry): void {
    for (const key in scriptConfig) {
        const propertyName = key as keyof ScriptEntry;
        if (isElementNotDefined(scriptConfig[propertyName])) {
            delete scriptConfig[propertyName];
        }
    }
    this.scriptStore.push(scriptConfig);
  }

  private addExternalScript(srcUrl: string, attributes: GenericObject, priority = LoadPriority.MEDIUM): void {
    this.addScriptConfig({ src: srcUrl, attributes, priority });
  }

  private addInlineScript(inlineCode: string, attributes: GenericObject, priority = LoadPriority.MEDIUM) {
    this.addScriptConfig({ inlineCode, attributes, priority });
  }

  public load() {
    for (let idx = 0; idx < this.scriptStore.length; idx++) {
        domHandler.append(this.scriptStore[idx], ElementType.SCRIPT);
    }
  }

  public init() {
    return {
      addSrc: this.addExternalScript.bind(this),
      addInline: this.addInlineScript.bind(this)
    };
  }
}

const scriptHandler = new ScriptHandler();

export default scriptHandler;
