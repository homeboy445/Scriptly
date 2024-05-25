import { isElementNotDefined, scriptMicroUtil } from "./Utility/utils";
import domHandler, { ElementType } from "./domHandler";
import {
  GenericObject,
  LoadPriority,
  ScriptEntry,
  ScriptStore,
} from "./types/types";
import { getModeObject } from "promise-butler";

class ScriptHandler {

  scriptStore: ScriptStore = Object.keys(LoadPriority).reduce((store, currLvl) => {
    store[(+currLvl) as keyof ScriptStore] = [];
    return store;
  }, ({} as ScriptStore));

  promiseManager = getModeObject();

  private addScriptConfig(scriptConfig: ScriptEntry, priority: LoadPriority): void {
    for (const key in scriptConfig) {
      const propertyName = key as keyof ScriptEntry;
      if (isElementNotDefined(scriptConfig[propertyName])) {
        delete scriptConfig[propertyName];
      }
    }
    this.scriptStore[priority].push({
        ...scriptConfig,
        attributes: Object.assign({ async: true }, scriptConfig.attributes),
    });
  }

  private addExternalScript(
    srcUrl: string,
    attributes: GenericObject,
    priority: LoadPriority
  ): void {
    this.addScriptConfig({ src: srcUrl, attributes }, priority);
  }

  private addInlineScript(
    inlineCode: string,
    attributes: GenericObject,
    priority: LoadPriority
  ) {
    this.addScriptConfig({ inlineCode, attributes }, priority);
  }

  public async load() {
    const promiseSequentialExecutor = (promiseArr: (() => Promise<any>)[]) => this.promiseManager.SEQUENTIAL()(promiseArr);
    const scriptExecutionCB = [LoadPriority.EXCEPTIONAL, LoadPriority.HIGH, LoadPriority.MEDIUM, LoadPriority.LOW].map((priorityLevel) => {
        const scriptExecutors = this.scriptStore[priorityLevel].map((scriptConfig) => {
            return () => {
                let promiseResolver: any = () => {};
                const scriptCompletionPromise: Promise<void> = new Promise((resolve) => {
                  promiseResolver = resolve;
                });
                if (scriptMicroUtil.isExternalScriptTag(scriptConfig)) {
                    scriptConfig.attributes = scriptConfig.attributes || {};
                    // TODO: Fix the below type!
                    const loadCb: any = scriptConfig.attributes.onload || (() => {});
                    scriptConfig.attributes.onload = () => {
                      loadCb?.();
                      promiseResolver();
                    };
                    const errorCb: any = scriptConfig.attributes.onerror || (() => {});
                    scriptConfig.attributes.onerror = () => {
                      errorCb?.();
                      promiseResolver();
                    };
                }
                if (!scriptConfig.processed) {
                  domHandler.append(scriptConfig, ElementType.SCRIPT);
                  scriptConfig.processed = true;
                } else {
                    promiseResolver();
                }
                if (scriptMicroUtil.isInlineScriptTag(scriptConfig)) {
                    promiseResolver();
                }
                return scriptCompletionPromise;
            }
        });
        return () => promiseSequentialExecutor(scriptExecutors);
    });
    await promiseSequentialExecutor(scriptExecutionCB);
  }

  public init() {
    const add = ((config: { attr?: GenericObject; priority?: LoadPriority } = {}) => {
      const { attr = {}, priority = LoadPriority.MEDIUM } = config;
      const src = (srcUrl: string) => {
        this.addExternalScript(srcUrl, attr, priority);
      };
      const inlineCode = (inlineCode: string) => {
        this.addInlineScript(inlineCode, attr, priority);
      };
      return { src, inlineCode };
    }).bind(this);
    return { add };
  }
}

const scriptHandler = new ScriptHandler();

export default scriptHandler;
