export interface IGroupMetadata {
    name: string;
    target: any;
}

export type TGroupsMetadata = IGroupMetadata[];

export interface IMigration {
    up(): Promise<void> | void;
    down(): Promise<void> | void;
}
