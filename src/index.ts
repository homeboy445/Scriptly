import eventBus from "./Utility/eventBus";
import ScriptHandler from "./scriptHandler";
import { Initializer, MainInitConfig, initConfig } from "../types/types";

/**
 * The entry point to the script orchestrator.
 * @param config Object
 * @returns
 */
const init: Initializer = (config: initConfig = { stateFull: true }): MainInitConfig => {
  const scriptHandler = new ScriptHandler(config);
  const scriptHandlerConfig = scriptHandler.init();
  return {
    scripts: scriptHandlerConfig,
    run: function (reRun = false) {
      return scriptHandler.run(reRun);
    },
    fireEvent: (eventName: string, data: any) => {
      eventBus.trigger(eventName, data);
    },
  };
};

export default init;
