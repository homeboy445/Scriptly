
export enum LoadPriority {
    LOW = 3,
    MEDIUM = 2,
    HIGH = 1,
    EXCEPTIONAL = 0
};

export enum EVENTS_ENUM {
    ERROR = "ERROR"
};

export enum NATIVE_EVENTS {
    DOM_LOAD = "DOMContentLoaded",
    WIN_LOAD = "load"
};

export interface initConfig {
    stateFull?: boolean;
};

export type ScriptEntry = {
    attributes?: Record<string, unknown>;
    processed?: boolean;
    eventListener?: { name: string; isCustom: boolean }
    timeout?: number;
} & ({ src: string; inlineCode?: never; } | { inlineCode: string; src?: never; });


export type ScriptStore = {
    [priorityLevel in LoadPriority]: Array<ScriptEntry>;
};

export interface GenericObject {
    [propertyName: string]: any
};

export type NOOP = () => void;
