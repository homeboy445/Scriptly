import eventBus from "./Utility/eventBus";
import ScriptHandler from "./scriptHandler";
import { initConfig } from "./types/types";

/**
 * The entry point to the script orchestrator.
 * @param config Object
 * @returns
 */
const init = (config: initConfig = { stateFull: true }) => {
  const scriptHandler = new ScriptHandler(config);
  const scriptHandlerConfig = scriptHandler.init();
  return {
    scripts: scriptHandlerConfig,
    run: function (reRun = false) {
      scriptHandler.run(reRun);
    },
    fireEvent: (eventName: string, data: any) => {
      eventBus.trigger(eventName, data);
    },
  };
};

export default init;
