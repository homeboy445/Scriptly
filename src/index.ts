import ScriptHandler from "./scriptHandler";
import { initConfig } from "./types/types";

/**
 * The entry point to the script orchestrator.
 * @param config Object
 * @returns void
 */
const init = (config: initConfig = { stateFull: true }) => {
    const scriptHandler = new ScriptHandler(config);
    const scriptHandlerConfig = scriptHandler.init();
    const loader = function (reRun = false) {
        scriptHandler.run(reRun);
    }
    return {
        scripts: scriptHandlerConfig,
        run: loader,
    };
}

export default init;
