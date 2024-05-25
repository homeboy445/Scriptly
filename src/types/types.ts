
export enum LoadPriority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    EXCEPTIONAL = 4
};

export type ScriptEntry = {
    attributes?: Record<string, unknown>;
    processed?: boolean;
} & ({ src: string; inlineCode?: never; } | { inlineCode: string; src?: never; });


export type ScriptStore = {
    [priorityLevel in LoadPriority]: Array<ScriptEntry>;
};

export interface GenericObject {
    [propertyName: string]: any
};

export type NOOP = () => void;
