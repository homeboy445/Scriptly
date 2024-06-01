"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NATIVE_EVENTS = exports.EVENTS_ENUM = exports.LoadPriority = void 0;
var LoadPriority;
(function (LoadPriority) {
    LoadPriority[LoadPriority["LOW"] = 3] = "LOW";
    LoadPriority[LoadPriority["MEDIUM"] = 2] = "MEDIUM";
    LoadPriority[LoadPriority["HIGH"] = 1] = "HIGH";
    LoadPriority[LoadPriority["EXCEPTIONAL"] = 0] = "EXCEPTIONAL";
})(LoadPriority || (exports.LoadPriority = LoadPriority = {}));
var EVENTS_ENUM;
(function (EVENTS_ENUM) {
    EVENTS_ENUM["ERROR"] = "ERROR";
})(EVENTS_ENUM || (exports.EVENTS_ENUM = EVENTS_ENUM = {}));
var NATIVE_EVENTS;
(function (NATIVE_EVENTS) {
    NATIVE_EVENTS["DOM_LOAD"] = "DOMContentLoaded";
    NATIVE_EVENTS["WIN_LOAD"] = "load";
})(NATIVE_EVENTS || (exports.NATIVE_EVENTS = NATIVE_EVENTS = {}));
