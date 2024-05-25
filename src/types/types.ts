
export enum LoadPriority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    EXCEPTIONAL = 4
};

export type ScriptEntry = {
    priority: LoadPriority;
    attributes?: Record<string, unknown>
} & ({ src: string; inlineCode?: never; } | { inlineCode: string; src?: never; });

export type ScriptStore = Array<ScriptEntry>;

export interface GenericObject {
    [propertyName: string]: any
};
