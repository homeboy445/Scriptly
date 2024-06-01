export enum LoadPriority {
  LOW = 3,
  MEDIUM = 2,
  HIGH = 1,
  EXCEPTIONAL = 0,
}

export enum EVENTS_ENUM {
  ERROR = "ERROR",
}

export enum NATIVE_EVENTS {
  DOM_LOAD = "DOMContentLoaded",
  WIN_LOAD = "load",
}

export interface initConfig {
  stateFull?: boolean;
}

export type ScriptEntry = {
  attributes?: Record<string, unknown>;
  processed?: boolean;
  eventListener?: { name: string; isCustom: boolean };
  timeout?: number;
} & ({ src: string; inlineCode?: never } | { inlineCode: string; src?: never });

export type ScriptStore = {
  [priorityLevel in LoadPriority]: Array<ScriptEntry>;
};

export interface GenericObject {
  [propertyName: string]: any;
}

export type NOOP = () => void;

interface AdditionalInfo {
  isCustom: boolean;
}

export type ScriptEntryCustom = ScriptEntry & { priority?: LoadPriority };

interface ScriptActions {
  listen(eventName: string, additionalInfo?: AdditionalInfo): void;
}

export interface InlineCodeActions {
  inlineCode: (codeString: string | Function | ((args: any[]) => void)) => ScriptActions;
}

export interface SrcActions {
  src: (srcUrl: string) => ScriptActions;
}

interface ScriptConfig {
  attr?: GenericObject;
  priority?: LoadPriority;
  timeout?: number;
}

export interface Scripts {
  load(scriptEntries: Array<ScriptEntryCustom>): void;
  add(config?: ScriptConfig): InlineCodeActions & SrcActions;
  entries(): Array<GenericObject>;
}

export interface MainInitConfig {
  fireEvent(eventName: string, data?: any): void;
  scripts: Scripts;
  run(reRun?: boolean): Promise<void>;
}

interface InitializerConfig {
  stateFull?: boolean;
}

export interface Initializer {
  (config?: InitializerConfig): MainInitConfig;
}
