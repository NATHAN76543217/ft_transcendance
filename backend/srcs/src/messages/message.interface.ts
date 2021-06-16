export default interface Message {
    id: number;
    id_sender: number;
    id_chat: number;
    created_at: Date;
    updated_at: Date;
    text: string;
}