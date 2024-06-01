
/// <reference types="cypress" />

import { Initializer, MainInitConfig } from "../../types/types";
import { bootStrapUrl, jQueryUrl } from "../fixtures/externalScripts";
import { JS_CODE_1 } from "../fixtures/inlineScripts";
import { filePathStore } from "../support/utils";

describe('ScriptOrchestrator initialization tests', () => {
  let scriptOrch: { default: Initializer }, mainInitConfig: MainInitConfig;

  beforeEach(() => {
    cy.visit('/public/index.html');
    cy.window().then((win: Window) => {
      scriptOrch = (win as any).scriptOrch;
      mainInitConfig = scriptOrch?.default?.();
    });
  });

  it('should initialize ScriptOrchestrator instance', () => {
    expect(mainInitConfig).to.exist;
  });

  it('should update the entries count', () => {
    
    mainInitConfig.scripts.add().src(jQueryUrl);
    
    let entries = mainInitConfig.scripts.entries();
    expect(entries).to.be.an('array');
    expect(Object.keys(entries).length).to.be.equal(1);
    expect(entries[0].src).to.be.equal(jQueryUrl);

    mainInitConfig.scripts.add().inlineCode(JS_CODE_1);

    entries = mainInitConfig.scripts.entries();
    expect(Object.keys(entries).length).to.be.equal(2);
    expect(entries[1].inlineCode).to.be.equal(JS_CODE_1);
  });

  it("should attributes should be updated correctly", () => {
    
    mainInitConfig.scripts.add({ attr: { testAttribute: "SomeValue" } }).src(jQueryUrl);
    
    let entries = mainInitConfig.scripts.entries();
    expect(entries[0].attributes).to.an("object");
    expect(entries[0].attributes.testAttribute).to.be.equal("SomeValue");
  });

  it('should add a script with specified priority', () => {
    mainInitConfig.scripts.add({ priority: 1 }).src(jQueryUrl);

    let entries = mainInitConfig.scripts.entries();
    expect(entries[0].priority).to.be.equal(1);
  });

});

describe('ScriptOrchestrator external scripts functional tests', () => {
  let scriptOrch: { default: Initializer }, mainInitConfig: MainInitConfig;

  beforeEach(() => {
    cy.visit('/public/index.html');
    cy.window().then((win: Window) => {
      scriptOrch = (win as any).scriptOrch;
      mainInitConfig = scriptOrch?.default?.();
    });
  });

  it("Should load external script tags", () => {
    mainInitConfig.scripts.add().src(jQueryUrl);
    mainInitConfig.run().then(() => {
      cy.window().then((fWindow: any) => {
        expect(fWindow.jQuery).to.be.a('function');
      });
    });
  });

  it("should handle js code as strings", () => {
    cy.window().then((fWindow: any) => {
      let value = 0;
      fWindow.testFunction = (val) => {
        value = val;
      };
      mainInitConfig.scripts.add({ priority: 1 }).inlineCode("testFunction(10)");
      mainInitConfig.run().then(() => {
        expect(value).to.be.equal(10);
      });
    });
  });

  it('should handle exceptional priority script execution immediately and handle function as valid input', () => {
    cy.window().then((fWindow: any) => {
      let value = 0;
      fWindow.testFunction = () => {
        value = 1;
      };
      mainInitConfig.scripts.add({ priority: 0 }).inlineCode(function () {
        (window as any).testFunction();
      });
      expect(value).to.be.equal(1);
    })
  });

  it('should run the ScriptOrchestrator and execute scripts as per priority', () => {
    cy.window().then((fWindow: any) => {
      const execOrder: number[] = [];
      fWindow.testFunction = (priorityValue: number) => {
        execOrder.push(priorityValue);
      }
      mainInitConfig.scripts.add({ priority: 1 }).inlineCode(function () {
        (window as any).testFunction(1);
      });
      mainInitConfig.scripts.add({ priority: 3 }).inlineCode(function () {
        (window as any).testFunction(3);
      });
      mainInitConfig.scripts.add({ priority: 2 }).inlineCode(function () {
        (window as any).testFunction(2);
      });
      mainInitConfig.run().then(() => {
        expect(execOrder.join(".")).to.be.equal("1.2.3");
      });
    })
  });

  it("should maintain the script execution order per priority", () => {
    cy.window().then((fWindow: any) => {
      const execOrder: number[] = [];
      fWindow.testFunction = (priorityValue: number) => {
        execOrder.push(priorityValue);
      }
      mainInitConfig.scripts.add({ priority: 1 }).inlineCode(function () {
        (window as any).testFunction(1);
      });
      mainInitConfig.scripts.add({ priority: 1 }).inlineCode(function () {
        (window as any).testFunction(2);
      });
      mainInitConfig.scripts.add({ priority: 1 }).inlineCode(function () {
        (window as any).testFunction(3);
      });
      mainInitConfig.run().then(() => {
        expect(execOrder.join(".")).to.be.equal("1.2.3");
      });
    });
  });

});

describe("ScriptOrchestrator inline scripts functional tests", () => {
  let scriptOrch: { default: Initializer }, mainInitConfig: MainInitConfig;

  beforeEach(() => {
    cy.visit('/public/index.html');
    cy.window().then((win: Window) => {
      scriptOrch = (win as any).scriptOrch;
      mainInitConfig = scriptOrch?.default?.();
    });
  });

  it('should handle exceptional priority script execution immediately', () => {
    cy.window().then((fWindow: any) => {
      let value = 0;
      fWindow.testFunction = (val) => {
        value = val;
      };
      mainInitConfig.scripts.add({ priority: 0 }).src(filePathStore.CODE_FILE_2);
      cy.wait(1000).then(() => {
        expect(value).to.be.equal(10);
      });
    })
  });

  it("should add multiple scripts as per priority", () => {
    const execOrderList: number[] = [];
    const getAttrObj = (execOrder: number) => {
      return { attr: { onload: () => {
        execOrderList.push(execOrder);
      }}};
    }
    mainInitConfig.scripts.add({ ...getAttrObj(1), priority: 3 }).src(filePathStore.CODE_FILE_1);
    mainInitConfig.scripts.add({ ...getAttrObj(2), priority: 1 }).src(jQueryUrl);
    mainInitConfig.scripts.add({ ...getAttrObj(3), priority: 2 }).src(bootStrapUrl);
    mainInitConfig.run().then(() => {
      cy.get('#codeFile1').should('exist');
      cy.window().then((fWindow: any) => {
        expect(fWindow.jQuery).to.be.a("function");
        expect(fWindow.bootstrap.Alert).to.be.a("function");
        expect(execOrderList.join(".")).to.be.equal("2.3.1");
      });
    });
  });

  it("should add multiple scripts in order", () => {
    const execOrderList: number[] = [];
    const getAttrObj = (execOrder: number) => {
      return { attr: { onload: () => {
        execOrderList.push(execOrder);
      }}};
    }
    mainInitConfig.scripts.add(getAttrObj(1)).src(filePathStore.CODE_FILE_1);
    mainInitConfig.scripts.add(getAttrObj(2)).src(jQueryUrl);
    mainInitConfig.scripts.add(getAttrObj(3)).src(bootStrapUrl);
    mainInitConfig.run().then(() => {
      cy.get('#codeFile1').should('exist');
      cy.window().then((fWindow: any) => {
        expect(fWindow.jQuery).to.be.a("function");
        expect(fWindow.bootstrap.Alert).to.be.a("function");
        expect(execOrderList.join(".")).to.be.equal("1.2.3");
      });
    });
  });
});

describe("ScriptOrchestrator core test cases", () => {
  let scriptOrch: { default: Initializer }, mainInitConfig: MainInitConfig;

  beforeEach(() => {
    cy.visit('/public/index.html');
    cy.window().then((win: Window) => {
      scriptOrch = (win as any).scriptOrch;
      mainInitConfig = scriptOrch?.default?.();
    });
  });

  it("should not maintain state if stateFull option is false", (done) => {
    let newMainInit = scriptOrch.default({ stateFull: false });
    newMainInit.scripts.add().src(filePathStore.CODE_FILE_1);
    newMainInit.scripts.add().inlineCode(function() {
      console.log('just testing!');
    });
    newMainInit.run().then(() => {
      expect(newMainInit.scripts.entries().length).to.be.equal(0);
      done();
    });
  });

  it("should not run already processed scripts", (done) => {
    cy.window().then(async (fWindow: any) => {
      const dataList: any[] = [];
      fWindow.testFunction = (val) => {
        dataList.push(val);
      };
      mainInitConfig.scripts.add().inlineCode(function () {
        (window as any).testFunction(1);
      });

      await mainInitConfig.run();

      expect(dataList.join(".")).to.be.equal("1");

      mainInitConfig.scripts.add().inlineCode(function () {
        (window as any).testFunction(2);
      });
      await mainInitConfig.run();

      // Shouldn't run the previous script again!
      expect(dataList.join(".")).to.be.equal("1.2");
      done();
    });
  });

  it("should re-run already processed scripts along with newer scripts if option is specified", (done) => {
    cy.window().then(async (fWindow: any) => {
      const dataList: any[] = [];
      fWindow.testFunction = (val) => {
        dataList.push(val);
      };
      mainInitConfig.scripts.add().inlineCode(function () {
        (window as any).testFunction(1);
      });

      await mainInitConfig.run();

      expect(dataList.join(".")).to.be.equal("1");

      mainInitConfig.scripts.add().inlineCode(function () {
        (window as any).testFunction(2);
      });
      await mainInitConfig.run(true);

      // Shouldn't run the previous script again!
      expect(dataList.join(".")).to.be.equal("1.1.2");
      done();
    });
  });

  it("should listen to DOM events and execute script", (done) => {
    cy.window().then((fWindow: any) => {
      const eventStore = {
        "DOMContentLoaded": false,
        "load": false
      };
      fWindow.testFunction = (eventName: string) => {
        eventStore[eventName] = true;
      };

      mainInitConfig.scripts.add().inlineCode(function() {
        console.log("DOM.load fired!");
        (window as any).testFunction("DOMContentLoaded");
      }).listen("DOMContentLoaded");

      mainInitConfig.scripts.add().inlineCode(function() {
        console.log("load fired!");
        (window as any).testFunction("load");
      }).listen("load");

      mainInitConfig.run().then(() => {
        expect(Object.values(eventStore).reduce((p, c) => c && p, true)).to.be.equal(true);
        done();
      });
    });
  });

  it("should listen to custom event and execute script", (done) => {
    cy.window().then((fWindow: any) => {
      const eventStore = {
        "customEvent_1": false,
        "customEvent_2": false
      };

      fWindow.testFunction = (eventName: string) => {
        eventStore[eventName] = true;
      };

      mainInitConfig.scripts.add().inlineCode(function() {
        (window as any).testFunction("customEvent_1");
      }).listen("customEvent_1", { isCustom: true });

      mainInitConfig.scripts.add().inlineCode(function() {
        (window as any).testFunction("customEvent_2");
      }).listen("customEvent_2", { isCustom: true });

      mainInitConfig.run().then(() => {
        mainInitConfig.fireEvent("customEvent_1");
        mainInitConfig.fireEvent("customEvent_2");
        expect(Object.values(eventStore).reduce((p, c) => c && p, true)).to.be.equal(true);
        done();
      });
    });
  });
});

