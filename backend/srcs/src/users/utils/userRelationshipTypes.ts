export enum UserRelationshipTypes {
    null = 0,
    
    pending_first_second = 1,
    pending_second_first = 2,
    friends = pending_first_second + pending_second_first,

    block_first_second = 4,
    block_second_first = 8,
    block_both = block_first_second + block_second_first,
}
