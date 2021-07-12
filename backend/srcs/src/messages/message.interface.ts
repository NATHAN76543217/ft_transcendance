export default interface Message {
    id: number;
    sender_id: number;
    channel_id: number;
    created_at: Date;
    updated_at: Date;
    text: string;
}