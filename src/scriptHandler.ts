import { isElementNotDefined, minifyCode, scriptMicroUtil } from "./Utility/utils";
import domHandler, { ElementType } from "./domHandler";
import {
  GenericObject,
  LoadPriority,
  ScriptEntry,
  ScriptStore,
  initConfig,
} from "./types/types";
import { getModeObject } from "promise-butler";

/**
 * Custom type extending ScriptEntry with an optional priority property.
 */
type ScriptEntryCustom = ScriptEntry & { priority?: LoadPriority };

const getBasePriorityValueObject = () => {
  return Object.keys(LoadPriority).reduce(
    (store, currLvl) => {
      const priorityKey = +currLvl as keyof ScriptStore;
      if (isNaN(priorityKey)) {
        return store;
      }
      store[priorityKey] = [];
      return store;
    },
    {} as ScriptStore
  );
};

/**
 * Class responsible for handling scripts.
 */
class ScriptHandler {

  /**
   * Stores the internal config.
   */
  config: initConfig = {};

  /**
   * Store to hold scripts based on priority levels.
   */
  scriptStore: ScriptStore = getBasePriorityValueObject();

  /**
   * Promise manager for handling script promises.
   */
  promiseManager = getModeObject();

  constructor(config: initConfig) {
    this.config = config;
  }

  /**
   * Validates and stores script entries based on priority.
   *
   * Expected structure per array entry:
   *
   * ```
   * {
   *    src?: url.com, // either src or inlineCode, not both!
   *    inlineCode?: "some code",
   *    priority?: 1,
   *    attributes: { ...anyAttributes }
   * }
   * ```
   *
   * @param scriptEntries Array of ScriptEntryCustom objects to validate and store.
   */
  private validateAndStore(scriptEntries: Array<ScriptEntryCustom>): void {
    for (let idx = 0; idx < scriptEntries.length; idx++) {
      const scriptConfig = scriptEntries[idx];
      if (
        scriptMicroUtil.isExternalScriptTag(scriptConfig) ||
        scriptMicroUtil.isInlineScriptTag(scriptConfig)
      ) {
        this.addScriptConfig(
          scriptConfig,
          scriptConfig.priority || LoadPriority.MEDIUM
        );
        delete scriptConfig.priority; // this will delete from the reference itself!
      }
    }
  }

  /**
   * Adds a script configuration to the script store based on priority.
   * @param scriptConfig ScriptEntry object to add.
   * @param priority Priority level of the script.
   */
  private addScriptConfig(
    scriptConfig: ScriptEntry,
    priority: LoadPriority
  ): void {
    for (const key in scriptConfig) {
      const propertyName = key as keyof ScriptEntry;
      if (isElementNotDefined(scriptConfig[propertyName])) {
        delete scriptConfig[propertyName];
      }
    }
    scriptConfig.attributes = scriptConfig.attributes || {};
    scriptConfig.attributes = Object.assign(
      { async: true },
      scriptConfig.attributes
    );
    if (
      scriptMicroUtil.isExternalScriptTag(scriptConfig) &&
      scriptMicroUtil.isInlineScriptTag(scriptConfig)
    ) {
      // In case a script entry contains both src and inlineCode, then we will create two separate entry for both of them!
      const scriptConfigWithHtml = { ...scriptConfig };
      delete scriptConfigWithHtml.src;
      this.scriptStore[priority].push(scriptConfigWithHtml);
      delete scriptConfig.inlineCode;
    }
    this.scriptStore[priority].push(scriptConfig);
  }

  /**
   * Adds an external script to the script store.
   * @param srcUrl URL of the external script.
   * @param attributes Attributes of the script.
   * @param priority Priority level of the script.
   */
  private addExternalScript(
    srcUrl: string,
    attributes: GenericObject,
    priority: LoadPriority
  ): void {
    this.addScriptConfig({ src: srcUrl, attributes }, priority);
  }

  /**
   * Adds an inline script to the script store.
   * @param inlineCode Code of the inline script.
   * @param attributes Attributes of the script.
   * @param priority Priority level of the script.
   */
  private async addInlineScript(
    inlineCode: string,
    attributes: GenericObject,
    priority: LoadPriority,
    minifyJS: boolean
  ) {
    let mainJScode = inlineCode;
    if (minifyJS) {
      mainJScode = await minifyCode(mainJScode)
    }
    this.addScriptConfig({ inlineCode: mainJScode, attributes }, priority);
  }

  /**
   * Loads scripts in a sequential manner based on priority levels.
   */
  public async run(reRun: boolean) {
    const promiseSequentialExecutor = (promiseArr: (() => Promise<any>)[]) =>
      this.promiseManager.SEQUENTIAL()(promiseArr);
    const scriptExecutionCB = [
      LoadPriority.EXCEPTIONAL,
      LoadPriority.HIGH,
      LoadPriority.MEDIUM,
      LoadPriority.LOW,
    ].map((priorityLevel) => {
      const scriptExecutors = this.scriptStore[priorityLevel].map(
        (scriptConfig) => {
          return () => {
            let promiseResolver: any = () => {};
            const scriptCompletionPromise: Promise<void> = new Promise(
              (resolve) => {
                promiseResolver = resolve;
              }
            );
            if (scriptMicroUtil.isExternalScriptTag(scriptConfig)) {
              scriptConfig.attributes = scriptConfig.attributes || {};
              // TODO: Fix the below type!
              const loadCb: any = scriptConfig.attributes.onload || (() => {});
              scriptConfig.attributes.onload = () => {
                loadCb?.();
                promiseResolver();
              };
              const errorCb: any =
                scriptConfig.attributes.onerror || (() => {});
              scriptConfig.attributes.onerror = () => {
                errorCb?.();
                promiseResolver();
              };
            }
            if (!scriptConfig.processed || reRun) {
              domHandler.append(scriptConfig, ElementType.SCRIPT);
              scriptConfig.processed = true;
            } else {
              promiseResolver();
            }
            if (scriptMicroUtil.isInlineScriptTag(scriptConfig)) {
              promiseResolver();
            }
            return scriptCompletionPromise;
          };
        }
      );
      return () => promiseSequentialExecutor(scriptExecutors);
    });

    await promiseSequentialExecutor(scriptExecutionCB);

    if (!this.config.stateFull) {
      // This will signify that we will not storing anything for this session!
      this.scriptStore = getBasePriorityValueObject();
    }
  }

  /**
   * Initializes the script handler with add and load functions.
   * @returns Object with add and load functions.
   */
  public init() {
    const add = ((
      config: { attr?: GenericObject; priority?: LoadPriority; minifyJS?: boolean } = {}
    ) => {
      const { attr = {}, priority = LoadPriority.MEDIUM, minifyJS = false } = config;
      const src = (srcUrl: string) => {
        this.addExternalScript(srcUrl, attr, priority);
      };
      const inlineCode = async (inlineCode: string) => {
        await this.addInlineScript(inlineCode, attr, priority, minifyJS);
      };
      return { src, inlineCode };
    }).bind(this);

    const load = ((scriptEntries: Array<ScriptEntryCustom>): void => {
      this.validateAndStore(scriptEntries);
    }).bind(this);

    return { add, load };
  }
}

export default ScriptHandler;
