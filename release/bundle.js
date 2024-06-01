var scriptOrch;(()=>{var e={309:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=new class{constructor(){this.store={}}isEvent(e){return!!(this.store[e]||[]).length}on(e,t){this.isEvent(e)&&i.off(e,t),this.store[e]=this.store[e]||[],this.store[e].push(t)}off(e,t){for(let i=0;i<this.store[e].length;i++)this.store[e][i]===t&&this.store[e].splice(i,1)}trigger(e,...t){this.store[e]&&this.store[e].forEach((e=>{e(...t)}))}};t.default=i},298:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.scriptMicroUtil=t.wrapFunctionOverTemplateCodeAndStringify=t.stringifyFunction=t.isFunction=t.isDefinedString=t.removeUndefinedKeys=t.isElementNotDefined=void 0,t.isElementNotDefined=e=>{const t=void 0===e,i=null===e,r=Number.isNaN(e);return t||i||r||""===e},t.removeUndefinedKeys=e=>{const t=Object.assign({},e);return Object.keys(t).forEach((e=>void 0===t[e]&&delete t[e])),t},t.isDefinedString=e=>!(0,t.isElementNotDefined)(e)&&"string"==typeof e,t.isFunction=e=>!(0,t.isElementNotDefined)(e)&&"function"==typeof e,t.stringifyFunction=e=>Function.prototype.toString.call(e),t.wrapFunctionOverTemplateCodeAndStringify=e=>`(${(0,t.stringifyFunction)(e)})()`,t.scriptMicroUtil={isExternalScriptTag:({src:e})=>!(0,t.isElementNotDefined)(e),isInlineScriptTag:({inlineCode:e})=>!(0,t.isElementNotDefined)(e),wrapExternalScriptActionMethods:(e,i)=>{if(!t.scriptMicroUtil.isExternalScriptTag(e))return;e.attributes=e.attributes||{};const r=e.attributes.onload||(()=>{});e.attributes.onload=()=>{null==r||r(),i()};const s=e.attributes.onerror||(()=>{});e.attributes.onerror=()=>{null==s||s(),i()}}}},762:function(e,t,i){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.ElementType=void 0;const s=r(i(309)),o=i(298),n=i(662);var c;!function(e){e[e.SCRIPT=1]="SCRIPT",e[e.STYLE=2]="STYLE"}(c||(t.ElementType=c={}));const l=new class{getScriptElement(e){const t=document.createElement("script");switch(t.type="text/javascript",Object.assign(t,e.attributes||{}),!0){case o.scriptMicroUtil.isExternalScriptTag(e):t.src=e.src||"";break;case o.scriptMicroUtil.isInlineScriptTag(e):t.textContent=e.inlineCode||"/* No code provided! */"}return t}append(e,t,i="HEAD"){try{switch(t){case c.SCRIPT:{const t=this.getScriptElement(e);(document.querySelector(i)||document.body).append(t);break}}}catch(t){t.details={when:"While appending script!",scriptConfigInfo:e},s.default.trigger(n.EVENTS_ENUM.ERROR,t)}}};t.default=l},156:function(e,t,i){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=r(i(309)),o=r(i(141));t.default=(e={stateFull:!0})=>{const t=new o.default(e);return{scripts:t.init(),run:function(e=!1){return t.run(e)},fireEvent:(e,t)=>{s.default.trigger(e,t)}}}},141:function(e,t,i){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,i,r){void 0===r&&(r=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,r,s)}:function(e,t,i,r){void 0===r&&(r=i),e[r]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&r(t,e,i);return s(t,e),t},n=this&&this.__awaiter||function(e,t,i,r){return new(i||(i=Promise))((function(s,o){function n(e){try{l(r.next(e))}catch(e){o(e)}}function c(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(n,c)}l((r=r.apply(e,t||[])).next())}))},c=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const l=c(i(309)),a=i(298),u=o(i(762)),d=i(662),h=i(114),p=()=>Object.keys(d.LoadPriority).reduce(((e,t)=>{const i=+t;return isNaN(i)||(e[i]=[]),e}),{});t.default=class{constructor(e){this.config={},this.scriptStore=p(),this.promiseManager=(0,h.getModeObject)(),this.config=e}validateAndStore(e){for(let t=0;t<e.length;t++){const i=e[t];(a.scriptMicroUtil.isExternalScriptTag(i)||a.scriptMicroUtil.isInlineScriptTag(i))&&(this.addScriptConfig(i,i.priority||d.LoadPriority.MEDIUM),delete i.priority)}}addScriptConfig(e,t,i){for(const t in e){const i=t;(0,a.isElementNotDefined)(e[i])&&delete e[i]}e.attributes=e.attributes||{},e.attributes=Object.assign({async:!0},e.attributes);let r=[];if(a.scriptMicroUtil.isExternalScriptTag(e)&&a.scriptMicroUtil.isInlineScriptTag(e)){const i=Object.assign({},e);delete i.src,this.scriptStore[t].push(i),r.push(this.scriptStore[t].length-1),delete e.inlineCode}return i&&(e.timeout=i),this.scriptStore[t].push(e),r.push(this.scriptStore[t].length-1),r}addExternalScript(e,t,i,r){const s={src:e,attributes:t};return i===d.LoadPriority.EXCEPTIONAL?(s.attributes=Object.assign({async:!0},s.attributes||{}),u.default.append(s,u.ElementType.SCRIPT),[-1]):this.addScriptConfig(s,i,r)}addInlineScript(e,t,i){let r="";(0,a.isDefinedString)(e)?r=e:(0,a.isFunction)(e)&&(r=(0,a.wrapFunctionOverTemplateCodeAndStringify)(e));const s={inlineCode:r,attributes:t};return i===d.LoadPriority.EXCEPTIONAL?(u.default.append(s,u.ElementType.SCRIPT),[-1]):this.addScriptConfig(s,i)}applyEventListener(e,t){const{eventListener:i}=e;if(i)if(null==i?void 0:i.isCustom)l.default.on(i.name,t);else{switch(i.name){case d.NATIVE_EVENTS.DOM_LOAD:"interactive"!==document.readyState&&"complete"!==document.readyState||t();break;case d.NATIVE_EVENTS.WIN_LOAD:"complete"===document.readyState&&t()}window.addEventListener(i.name,t)}}run(e){return n(this,void 0,void 0,(function*(){const t=e=>this.promiseManager.SEQUENTIAL()(e),i=[d.LoadPriority.HIGH,d.LoadPriority.MEDIUM,d.LoadPriority.LOW].map((i=>{const r=this.scriptStore[i].map((t=>()=>{let i=()=>{};const r=new Promise((e=>{const r=setTimeout((()=>{i()}),t.timeout||3e4);i=()=>{clearTimeout(r),e()}})),s=()=>{u.default.append(t,u.ElementType.SCRIPT),t.processed=!0};return t.eventListener?(this.applyEventListener(t,s),i()):!t.processed||e?(a.scriptMicroUtil.wrapExternalScriptActionMethods(t,i),s()):i(),a.scriptMicroUtil.isInlineScriptTag(t)&&i(),r}));return()=>t(r)}));yield t(i),this.config.stateFull||(this.scriptStore=p())}))}updateConfigWithEventListener(e,t,i){e.eventListener=Object.assign({name:t},i)}entries(){return Object.keys(this.scriptStore).reduce(((e,t)=>{const i=+t;return[...e,...this.scriptStore[i].map((e=>(e.attributes=Object.assign({},e.attributes),delete e.attributes.async,Object.assign(Object.assign({},e),{priority:i}))))]}),[])}init(){return{add:((e={})=>{const{attr:t={},priority:i=d.LoadPriority.MEDIUM,timeout:r}=e;t.src&&delete t.src,Object.assign(t,(0,a.removeUndefinedKeys)(Object.assign(Object.assign({},e),{priority:void 0,timeout:void 0})));const s=e=>({listen:(t,r={isCustom:!1})=>{if(i!==d.LoadPriority.EXCEPTIONAL)for(let s=0;s<e.length;s++)this.updateConfigWithEventListener(this.scriptStore[i][e[s]],t,r)}});return{src:e=>{const o=this.addExternalScript(e,t,i,r);return s(o)},inlineCode:e=>{const r=this.addInlineScript(e,t,i);return s(r)}}}).bind(this),load:(e=>{this.validateAndStore(e)}).bind(this),entries:this.entries.bind(this)}}}},662:(e,t)=>{"use strict";var i,r,s;Object.defineProperty(t,"__esModule",{value:!0}),t.NATIVE_EVENTS=t.EVENTS_ENUM=t.LoadPriority=void 0,function(e){e[e.LOW=3]="LOW",e[e.MEDIUM=2]="MEDIUM",e[e.HIGH=1]="HIGH",e[e.EXCEPTIONAL=0]="EXCEPTIONAL"}(i||(t.LoadPriority=i={})),function(e){e.ERROR="ERROR"}(r||(t.EVENTS_ENUM=r={})),function(e){e.DOM_LOAD="DOMContentLoaded",e.WIN_LOAD="load"}(s||(t.NATIVE_EVENTS=s={}))},114:e=>{(()=>{"use strict";var t,i={d:(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},r={};i.r(r),i.d(r,{getModeObject:()=>a}),function(e){e.SEQUENTIAL="SEQUENTIAL",e.BATCHED="BATCHED",e.PIPELINING="PIPELINING",e.PARALLEL="PARALLEL"}(t||(t={}));var s=function(e,t,i,r){return new(i||(i=Promise))((function(s,o){function n(e){try{l(r.next(e))}catch(e){o(e)}}function c(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(n,c)}l((r=r.apply(e,t||[])).next())}))};class o{constructor({batchSize:e,debugMode:t,batchWiseCallback:i}){this.requestsArr=[],this.globalPromiseStore={promise:Promise.resolve(),pending:!1},this.BATCH_SIZE=6,this.batchWiseCallback=(...e)=>{},this.promiseResolvedStore={resolve:e=>{}},this.requestCounter=0,this.debugMode=!1,this.debugMode=null!=t?t:this.debugMode,this.BATCH_SIZE=null!=e?e:this.BATCH_SIZE,this.batchWiseCallback=null!=i?i:this.batchWiseCallback,this.log("Input params are: ",arguments)}log(...e){this.debugMode&&console.log(...e)}processPromise(e,t){return s(this,void 0,void 0,(function*(){if(this.globalPromiseStore.pending)return yield this.globalPromiseStore.promise,this.processPromise(e,t);this.log("Adding the promise in the array! ",t),this.requestsArr.push(e().then((e=>this.promiseResolvedStore[t]=e)).catch((e=>this.promiseResolvedStore[t]=e)).then((()=>{var e,i;return null===(i=null===(e=this.promiseResolvedStore)||void 0===e?void 0:e.resolve)||void 0===i?void 0:i.call(e,t)}))),this.requestsArr.length==this.BATCH_SIZE&&(this.globalPromiseStore={promise:Promise.all(this.requestsArr).catch((e=>{this.log("There was an error while processing a batch: ",e)})).then((()=>{this.log("A batch got completed!"),this.batchWiseCallback(this.requestsArr),this.requestsArr=[],this.globalPromiseStore.pending=!1})),pending:!0})}))}dispatch(e){return s(this,void 0,void 0,(function*(){return new Promise((t=>{this.promiseResolvedStore.resolve=i=>{this.log("The promise at index",i," is complete!"),++this.requestCounter==e.length&&(this.log("All of the promises are resolved!"),delete this.promiseResolvedStore.resolve,t(Object.values(this.promiseResolvedStore)))};for(let t=0;t<e.length;t++)this.processPromise(e[t],t)}))}))}}var n=function(e,t,i,r){return new(i||(i=Promise))((function(s,o){function n(e){try{l(r.next(e))}catch(e){o(e)}}function c(e){try{l(r.throw(e))}catch(e){o(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(n,c)}l((r=r.apply(e,t||[])).next())}))};class c{constructor({debugMode:e,slotSize:t}){this.requestSlots={},this.SLOT_SIZE=6,this.requestCounter=0,this.globalPromiseStore={resolve:e=>{},reject:()=>{},resolvedPromises:{}},this.promiseRequestStore={},this.debugMode=!1,this.debugMode=null!=e?e:this.debugMode,this.SLOT_SIZE=null!=t?t:this.SLOT_SIZE}log(...e){this.debugMode&&console.log(...e)}executePromise(e,t){return n(this,void 0,void 0,(function*(){const{value:i,done:r}=e.next();if(r||!i)return Promise.resolve();const{promiseCallback:s,index:o}=i,c=`${t}.${++this.requestCounter}`;return this.promiseRequestStore[c]=!1,this.log("Assigning the promise callback at index: ",o,", to slot: ",t),this.requestSlots[t].then((()=>{const e=s();return this.log("Outcome of the promise of index: ",o," ",e),e})).catch((e=>(this.log("promise failed in slot: ",t),e))).then((i=>n(this,void 0,void 0,(function*(){this.log("promise at index: ",o," is complete!"),delete this.promiseRequestStore[c],this.globalPromiseStore.resolvedPromises[o]=i,yield this.executePromise(e,t),0===Object.keys(this.promiseRequestStore).length&&(this.globalPromiseStore.resolve(Object.values(this.globalPromiseStore.resolvedPromises)),this.promiseRequestStore={done:!0})}))))}))}dispatch(e){return n(this,void 0,void 0,(function*(){return new Promise(((t,i)=>{const r=function*(){for(let t=0;t<e.length;t++)yield{promiseCallback:e[t],index:t}}();this.globalPromiseStore={resolve:t,reject:i,resolvedPromises:{}};for(let e=0;e<this.SLOT_SIZE;e++)this.requestSlots[e]=Promise.resolve(),this.executePromise(r,e)}))}))}}class l{constructor({debugMode:e}){var t;this.requestPromise=Promise.resolve(),this.debugMode=!1,this.debugMode=null!==(t=this.debugMode)&&void 0!==t?t:e}log(...e){this.debugMode&&console.log(...e)}dispatch(e){const t={},i=this;return new Promise((r=>{e.forEach(((e,r)=>{i.requestPromise=i.requestPromise.then((()=>e().then((e=>{i.log("The promise of index: ",r," is successfull!"),t[r]=e})).catch((e=>{i.log("The promise of index: ",r," is failed!"),t[r]=e}))))})),i.requestPromise=this.requestPromise.then((()=>{i.log("The promise is complete!"),r(Object.values(t))}))}))}}const a=(e={debugMode:!1})=>({[t.SEQUENTIAL]:()=>{const t=new l(e);return t.dispatch.bind(t)},[t.BATCHED]:(t=6,i=((...e)=>{}))=>{const r=new o(Object.assign(Object.assign({},e),{batchSize:t,batchWiseCallback:i}));return r.dispatch.bind(r)},[t.PIPELINING]:(t=6)=>{const i=new c(Object.assign(Object.assign({},e),{slotSize:t}));return i.dispatch.bind(i)}});e.exports=r})()}},t={},i=function i(r){var s=t[r];if(void 0!==s)return s.exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,i),o.exports}(156);scriptOrch=i})();