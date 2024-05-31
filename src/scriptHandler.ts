import eventBus from "./Utility/eventBus";
import {
  isDefinedString,
  isElementNotDefined,
  isFunction,
  scriptMicroUtil,
  wrapFunctionOverTemplateCodeAndStringify,
} from "./Utility/utils";
import domHandler, { ElementType } from "./domHandler";
import {
  GenericObject,
  LoadPriority,
  NATIVE_EVENTS,
  ScriptEntry,
  ScriptStore,
  initConfig,
} from "./types/types";
import { getModeObject } from "promise-butler";

/**
 * Custom type extending ScriptEntry with an optional priority property.
 */
type ScriptEntryCustom = ScriptEntry & { priority?: LoadPriority };

/**
 * Creates a base object out of the LoadPriority enum. Each priority key will contain an empty array.
 * @returns Object
 */
const getBasePriorityValueObject = () => {
  return Object.keys(LoadPriority).reduce((store, currLvl) => {
    const priorityKey = +currLvl as keyof ScriptStore;
    if (isNaN(priorityKey)) {
      return store;
    }
    store[priorityKey] = [];
    return store;
  }, {} as ScriptStore);
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
    priority: LoadPriority,
    timeout?: number
  ): number[] {
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
    let idxList = [];
    if (
      scriptMicroUtil.isExternalScriptTag(scriptConfig) &&
      scriptMicroUtil.isInlineScriptTag(scriptConfig)
    ) {
      // In case a script entry contains both src and inlineCode, then we will create two separate entry for both of them!
      const scriptConfigWithHtml = { ...scriptConfig };
      delete scriptConfigWithHtml.src;
      this.scriptStore[priority].push(scriptConfigWithHtml);
      idxList.push(this.scriptStore[priority].length - 1);
      delete scriptConfig.inlineCode;
    }

    if (timeout) {
      // The timeout will only be applicable for externally loaded script tags!
      scriptConfig.timeout = timeout;
    }

    this.scriptStore[priority].push(scriptConfig);
    idxList.push(this.scriptStore[priority].length - 1);
    return idxList;
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
    priority: LoadPriority,
    timeout?: number
  ): number[] {
    const scriptConfig = { src: srcUrl, attributes };

    if (priority === LoadPriority.EXCEPTIONAL) {
      scriptConfig.attributes = Object.assign(
        { async: true },
        scriptConfig.attributes || {}
      );
      return domHandler.append(scriptConfig, ElementType.SCRIPT), [-1];
    }

    return this.addScriptConfig(scriptConfig, priority, timeout);
  }

  /**
   * Adds an inline script to the script store.
   * @param inlineCode Code of the inline script.
   * @param attributes Attributes of the script.
   * @param priority Priority level of the script.
   */
  private addInlineScript(
    inlineCode: string | Function,
    attributes: GenericObject,
    priority: LoadPriority
  ): number[] {
    let mainJScode = "";

    if (isDefinedString(inlineCode)) {
      mainJScode = inlineCode;
    } else if (isFunction(inlineCode)) {
      mainJScode = wrapFunctionOverTemplateCodeAndStringify(inlineCode);
    }

    const scriptConfig = { inlineCode: mainJScode, attributes };

    if (priority === LoadPriority.EXCEPTIONAL) {
      // In case of EXCEPTIONAL priority, the script will invoked immediately without the execution of the scriptConfig queue!
      // In case of this mode, the script will not be store inside the queue! And hence this mode will be stateless!
      return domHandler.append(scriptConfig, ElementType.SCRIPT), [-1];
    }

    return this.addScriptConfig(scriptConfig, priority);
  }

  /**
   * Applies an event listener based on the eventListener configuration in the script entry.
   * If the eventListener is custom, it subscribes to the event using eventBus.
   * If the eventListener is a native event, it checks the document ready state and adds the event listener to the window.
   * @param scriptConfig The script entry configuration.
   * @param callback The callback function to be executed when the event occurs.
   */
  private applyEventListener(scriptConfig: ScriptEntry, callback: () => void) {
    const { eventListener } = scriptConfig;
    if (!eventListener) {
      return;
    }
    if (eventListener?.isCustom) {
      eventBus.on(eventListener.name, callback);
    } else {
      switch (eventListener.name) {
        case NATIVE_EVENTS.DOM_LOAD: {
          // If these conditions don't meet - just fall down to default!
          if (
            document.readyState === "interactive" ||
            document.readyState === "complete"
          ) {
            callback();
          }
          break;
        }
        case NATIVE_EVENTS.WIN_LOAD: {
          if (document.readyState === "complete") {
            callback();
          }
          break;
        }
        default: {
        }
      }
      window.addEventListener(
        eventListener.name as keyof WindowEventMap,
        callback
      );
    }
  }

  /**
   * Loads scripts in a sequential manner based on priority levels.
   */
  public async run(reRun: boolean) {
    const promiseSequentialExecutor = (promiseArr: (() => Promise<any>)[]) =>
      this.promiseManager.SEQUENTIAL()(promiseArr);
    const scriptExecutionCB = [
      LoadPriority.HIGH,
      LoadPriority.MEDIUM,
      LoadPriority.LOW,
    ].map((priorityLevel) => {
      const scriptExecutors = this.scriptStore[priorityLevel].map(
        (scriptConfig) => {
          return () => {
            // Promise will resolve when the script is either fully loaded or it errored out!
            let promiseResolver: any = () => {};
            const scriptCompletionPromise: Promise<void> = new Promise(
              (resolve) => {
                const timeout = setTimeout(() => {
                  // We will wait for sometime for the script to load!
                  promiseResolver();
                }, scriptConfig.timeout || 30000);
                promiseResolver = () => {
                  clearTimeout(timeout);
                  resolve();
                };
              }
            );

            const appendElementCB = () => {
              domHandler.append(scriptConfig, ElementType.SCRIPT);
              scriptConfig.processed = true;
            };

            if (scriptConfig.eventListener) {
              // In case of an event listener, we will resolve the promise since we do not want to block others!
              this.applyEventListener(scriptConfig, appendElementCB);
              promiseResolver();
            } else if (!scriptConfig.processed || reRun) {
              // Attaching callbacks for listening to script.src completion if applicable!
              scriptMicroUtil.wrapExternalScriptActionMethods(
                scriptConfig,
                promiseResolver
              );
              appendElementCB();
            } else {
              // In case the script is marked processed, we need not run it unless reRun is specified as true!
              // So, resolving the promise here!
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

  public updateConfigWithEventListener(
    scriptConfigObject: ScriptEntry,
    eventName: string,
    additionalInfo: { isCustom: boolean }
  ): void {
    scriptConfigObject.eventListener = { name: eventName, ...additionalInfo };
  }

  /**
   * Initializes the script handler with add and load functions.
   * @returns Object with add and load functions.
   */
  public init() {
    const add = ((
      config: {
        attr?: GenericObject;
        priority?: LoadPriority;
        timeout?: number;
      } = {}
    ) => {
      const { attr = {}, priority = LoadPriority.MEDIUM, timeout } = config;

      if (attr.src) {
        delete attr.src;
      }

      const getSecondLvlChain = (indexList: number[]) => {
        return {
          listen: (
            eventName: string,
            additionalInfo: { isCustom: boolean } = { isCustom: false }
          ): void => {
            // For 'EXCEPTIONAL' priority, event listeners will not be applicable!
            if (priority === LoadPriority.EXCEPTIONAL) {
              return;
            }

            for (let idx = 0; idx < indexList.length; idx++) {
              this.updateConfigWithEventListener(
                this.scriptStore[priority][indexList[idx]],
                eventName,
                additionalInfo
              );
            }
          },
        };
      };

      const src = (srcUrl: string) => {
        const indexList = this.addExternalScript(
          srcUrl,
          attr,
          priority,
          timeout
        );
        return getSecondLvlChain(indexList);
      };

      const inlineCode = (inlineCode: string | Function) => {
        const indexList = this.addInlineScript(inlineCode, attr, priority);
        return getSecondLvlChain(indexList);
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
