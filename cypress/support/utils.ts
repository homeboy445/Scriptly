
const fixturesRelPath = "../cypress/fixtures";

const JS_CODE_FILES = {
    CODE_FILE_1: "codeFile.1.js",
    CODE_FILE_2: "codeFile.2.js"
};

const getFilePath = (fileName: string) => `${fixturesRelPath}/${fileName}`;

type filePathStore = { [props in keyof typeof JS_CODE_FILES]: string };

const filePathStore = Object.keys(JS_CODE_FILES).reduce((store, fileName) => {
    store[fileName] = getFilePath(JS_CODE_FILES[fileName]);
    return store;
}, ({} as filePathStore));

export { filePathStore };
