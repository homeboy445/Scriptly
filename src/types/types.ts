
export enum LoadPriority {
    LOW = 4,
    MEDIUM = 3,
    HIGH = 2,
    EXCEPTIONAL = 1
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
