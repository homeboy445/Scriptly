"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventBus_1 = __importDefault(require("./Utility/eventBus"));
const scriptHandler_1 = __importDefault(require("./scriptHandler"));
/**
 * The entry point to the script orchestrator.
 * @param config Object
 * @returns
 */
const init = (config = { stateFull: true }) => {
    const scriptHandler = new scriptHandler_1.default(config);
    const scriptHandlerConfig = scriptHandler.init();
    return {
        scripts: scriptHandlerConfig,
        run: function (reRun = false) {
            return scriptHandler.run(reRun);
        },
        fireEvent: (eventName, data) => {
            eventBus_1.default.trigger(eventName, data);
        },
    };
};
exports.default = init;
