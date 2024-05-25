import scriptHandler from "./scriptHandler";

const init = () => {
    const scriptHandlerConfig = scriptHandler.init();
    const loader = function () {
        scriptHandler.load();
    }
    return {
        scripts: scriptHandlerConfig,
        run: loader
    };
}

export default init;
