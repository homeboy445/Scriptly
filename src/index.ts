import ScriptHandler from "./scriptHandler";
import { initConfig } from "./types/types";

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
