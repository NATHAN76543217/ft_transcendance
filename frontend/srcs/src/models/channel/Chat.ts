export enum ChatType {
    USER,
    PUBLIC,
    PRIVATE,
    PROTECTED,
}

export type Chat = {
    name: string;
    id: number;
    type: ChatType;
}