import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { IAbilityFactory } from 'src/authorization/policies.guard';
import User from 'src/users/user.entity';
import { UserRole } from 'src/users/utils/userRole';
import { Message } from './message.entity';

export enum MessageAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof Message | typeof User> | 'all';

export type MessageAbility = Ability<[MessageAction, Subjects]>;

@Injectable()
export class MessageCaslAbilityFactory
  implements IAbilityFactory<MessageAbility>
{
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<MessageAbility>(
      Ability as AbilityClass<MessageAbility>,
    );

    if (user.role & (UserRole.Admin | UserRole.Owner)) {
      // Admin abilities
      can(MessageAction.Manage, 'all');
    } else {
      // User abilities
      can(MessageAction.Create, 'all');
    }

    // Can manage Message if sender
    can(MessageAction.Manage, Message, {
      sender_id: { $eq: user.id },
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
