"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventBus_1 = __importDefault(require("./Utility/eventBus"));
const utils_1 = require("./Utility/utils");
const domHandler_1 = __importStar(require("./domHandler"));
const types_1 = require("../types/types");
const promise_butler_1 = require("promise-butler");
/**
 * Creates a base object out of the LoadPriority enum. Each priority key will contain an empty array.
 * @returns Object
 */
const getBasePriorityValueObject = () => {
    return Object.keys(types_1.LoadPriority).reduce((store, currLvl) => {
        const priorityKey = +currLvl;
        if (isNaN(priorityKey)) {
            return store;
        }
        store[priorityKey] = [];
        return store;
    }, {});
};
/**
 * Class responsible for handling scripts.
 */
class ScriptHandler {
    constructor(config) {
        /**
         * Stores the internal config.
         */
        this.config = {};
        /**
         * Store to hold scripts based on priority levels.
         */
        this.scriptStore = getBasePriorityValueObject();
        /**
         * Promise manager for handling script promises.
         */
        this.promiseManager = (0, promise_butler_1.getModeObject)();
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
    validateAndStore(scriptEntries) {
        for (let idx = 0; idx < scriptEntries.length; idx++) {
            const scriptConfig = scriptEntries[idx];
            if (utils_1.scriptMicroUtil.isExternalScriptTag(scriptConfig) ||
                utils_1.scriptMicroUtil.isInlineScriptTag(scriptConfig)) {
                this.addScriptConfig(scriptConfig, scriptConfig.priority || types_1.LoadPriority.MEDIUM);
                delete scriptConfig.priority; // this will delete from the reference itself!
            }
        }
    }
    /**
     * Adds a script configuration to the script store based on priority.
     * @param scriptConfig ScriptEntry object to add.
     * @param priority Priority level of the script.
     */
    addScriptConfig(scriptConfig, priority, timeout) {
        for (const key in scriptConfig) {
            const propertyName = key;
            if ((0, utils_1.isElementNotDefined)(scriptConfig[propertyName])) {
                delete scriptConfig[propertyName];
            }
        }
        scriptConfig.attributes = scriptConfig.attributes || {};
        scriptConfig.attributes = Object.assign({ async: true }, scriptConfig.attributes);
        let idxList = [];
        if (utils_1.scriptMicroUtil.isExternalScriptTag(scriptConfig) &&
            utils_1.scriptMicroUtil.isInlineScriptTag(scriptConfig)) {
            // In case a script entry contains both src and inlineCode, then we will create two separate entry for both of them!
            const scriptConfigWithHtml = Object.assign({}, scriptConfig);
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
    addExternalScript(srcUrl, attributes, priority, timeout) {
        const scriptConfig = { src: srcUrl, attributes };
        if (priority === types_1.LoadPriority.EXCEPTIONAL) {
            scriptConfig.attributes = Object.assign({ async: true }, scriptConfig.attributes || {});
            return domHandler_1.default.append(scriptConfig, domHandler_1.ElementType.SCRIPT), [-1];
        }
        return this.addScriptConfig(scriptConfig, priority, timeout);
    }
    /**
     * Adds an inline script to the script store.
     * @param inlineCode Code of the inline script.
     * @param attributes Attributes of the script.
     * @param priority Priority level of the script.
     */
    addInlineScript(inlineCode, attributes, priority) {
        let mainJScode = "";
        if ((0, utils_1.isDefinedString)(inlineCode)) {
            mainJScode = inlineCode;
        }
        else if ((0, utils_1.isFunction)(inlineCode)) {
            mainJScode = (0, utils_1.wrapFunctionOverTemplateCodeAndStringify)(inlineCode);
        }
        const scriptConfig = { inlineCode: mainJScode, attributes };
        if (priority === types_1.LoadPriority.EXCEPTIONAL) {
            // In case of EXCEPTIONAL priority, the script will invoked immediately without the execution of the scriptConfig queue!
            // In case of this mode, the script will not be store inside the queue! And hence this mode will be stateless!
            return domHandler_1.default.append(scriptConfig, domHandler_1.ElementType.SCRIPT), [-1];
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
    applyEventListener(scriptConfig, callback) {
        const { eventListener } = scriptConfig;
        if (!eventListener) {
            return;
        }
        if (eventListener === null || eventListener === void 0 ? void 0 : eventListener.isCustom) {
            eventBus_1.default.on(eventListener.name, callback);
        }
        else {
            switch (eventListener.name) {
                case types_1.NATIVE_EVENTS.DOM_LOAD: {
                    // If these conditions don't meet - just fall down to default!
                    if (document.readyState === "interactive" ||
                        document.readyState === "complete") {
                        callback();
                    }
                    break;
                }
                case types_1.NATIVE_EVENTS.WIN_LOAD: {
                    if (document.readyState === "complete") {
                        callback();
                    }
                    break;
                }
                default: {
                }
            }
            window.addEventListener(eventListener.name, callback);
        }
    }
    /**
     * Loads scripts in a sequential manner based on priority levels.
     */
    run(reRun) {
        return __awaiter(this, void 0, void 0, function* () {
            const promiseSequentialExecutor = (promiseArr) => this.promiseManager.SEQUENTIAL()(promiseArr);
            const scriptExecutionCB = [
                types_1.LoadPriority.HIGH,
                types_1.LoadPriority.MEDIUM,
                types_1.LoadPriority.LOW,
            ].map((priorityLevel) => {
                const scriptExecutors = this.scriptStore[priorityLevel].map((scriptConfig) => {
                    return () => {
                        // Promise will resolve when the script is either fully loaded or it errored out!
                        let promiseResolver = () => { };
                        const scriptCompletionPromise = new Promise((resolve) => {
                            const timeout = setTimeout(() => {
                                // We will wait for sometime for the script to load!
                                promiseResolver();
                            }, scriptConfig.timeout || 30000);
                            promiseResolver = () => {
                                clearTimeout(timeout);
                                resolve();
                            };
                        });
                        const appendElementCB = () => {
                            domHandler_1.default.append(scriptConfig, domHandler_1.ElementType.SCRIPT);
                            scriptConfig.processed = true;
                        };
                        if (scriptConfig.eventListener) {
                            // In case of an event listener, we will resolve the promise since we do not want to block others!
                            this.applyEventListener(scriptConfig, appendElementCB);
                            promiseResolver();
                        }
                        else if (!scriptConfig.processed || reRun) {
                            // Attaching callbacks for listening to script.src completion if applicable!
                            utils_1.scriptMicroUtil.wrapExternalScriptActionMethods(scriptConfig, promiseResolver);
                            appendElementCB();
                        }
                        else {
                            // In case the script is marked processed, we need not run it unless reRun is specified as true!
                            // So, resolving the promise here!
                            promiseResolver();
                        }
                        if (utils_1.scriptMicroUtil.isInlineScriptTag(scriptConfig)) {
                            promiseResolver();
                        }
                        return scriptCompletionPromise;
                    };
                });
                return () => promiseSequentialExecutor(scriptExecutors);
            });
            yield promiseSequentialExecutor(scriptExecutionCB);
            if (!this.config.stateFull) {
                // This will signify that we will not storing anything for this session!
                this.scriptStore = getBasePriorityValueObject();
            }
        });
    }
    updateConfigWithEventListener(scriptConfigObject, eventName, additionalInfo) {
        scriptConfigObject.eventListener = Object.assign({ name: eventName }, additionalInfo);
    }
    /**
     * Retrieves all script entries from the script store.
     * @returns An array of script entries with updated attributes and priority.
     */
    entries() {
        return Object.keys(this.scriptStore).reduce((entryList, priorityValue) => {
            const priorityKey = +priorityValue;
            const scriptsList = this.scriptStore[priorityKey].map((scriptEntries) => {
                scriptEntries.attributes = Object.assign({}, scriptEntries.attributes);
                delete scriptEntries.attributes.async;
                return Object.assign(Object.assign({}, scriptEntries), { priority: priorityKey });
            });
            return [...entryList, ...scriptsList];
        }, []);
    }
    /**
     * Initializes the script handler with add and load functions.
     * @returns Object with add and load functions.
     */
    init() {
        const add = ((config = {}) => {
            const { attr = {}, priority = types_1.LoadPriority.MEDIUM, timeout } = config;
            if (attr.src) {
                delete attr.src;
            }
            // Assigning the global keys to attr object!
            Object.assign(attr, (0, utils_1.removeUndefinedKeys)(Object.assign(Object.assign({}, config), { priority: undefined, timeout: undefined })));
            const getSecondLvlChain = (indexList) => {
                return {
                    listen: (eventName, additionalInfo = { isCustom: false }) => {
                        // For 'EXCEPTIONAL' priority, event listeners will not be applicable!
                        if (priority === types_1.LoadPriority.EXCEPTIONAL) {
                            return;
                        }
                        for (let idx = 0; idx < indexList.length; idx++) {
                            this.updateConfigWithEventListener(this.scriptStore[priority][indexList[idx]], eventName, additionalInfo);
                        }
                    },
                };
            };
            const src = (srcUrl) => {
                const indexList = this.addExternalScript(srcUrl, attr, priority, timeout);
                return getSecondLvlChain(indexList);
            };
            const inlineCode = (inlineCode) => {
                const indexList = this.addInlineScript(inlineCode, attr, priority);
                return getSecondLvlChain(indexList);
            };
            return { src, inlineCode };
        }).bind(this);
        const load = ((scriptEntries) => {
            this.validateAndStore(scriptEntries);
        }).bind(this);
        return { add, load, entries: this.entries.bind(this) };
    }
}
exports.default = ScriptHandler;
