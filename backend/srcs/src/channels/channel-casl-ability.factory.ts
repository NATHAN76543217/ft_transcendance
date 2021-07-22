import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { IAbilityFactory } from 'src/authorization/policies.guard';
import User from 'src/users/user.interface';
import { UserRole } from 'src/users/utils/userRole';
import Channel from './channel.entity';
import { ChannelRelationshipType } from './relationships/channel-relationship.type';
import { ChannelMode } from './utils/channelModeTypes';

export enum ChannelAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Speak = 'speak',
  Join = 'join',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof Channel | User> | 'all';

export type ChannelAbility = Ability<[ChannelAction, Subjects]>;

@Injectable()
export class ChannelCaslAbilityFactory
  implements IAbilityFactory<ChannelAbility>
{
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<ChannelAbility>(
      Ability as AbilityClass<ChannelAbility>,
    );

    if (user.role & (UserRole.Admin | UserRole.Owner)) {
      // Admin abilities
      can(ChannelAction.Manage, 'all');
    } else {
      // User abilities
      can(ChannelAction.Create, 'all');
      can(ChannelAction.Read, 'all');
    }

    // Can join channel if public
    can(ChannelAction.Join, Channel, {
      mode: ChannelMode.public,
    });

    // Can join channel if invited
    can(ChannelAction.Join, Channel, {
      mode: ChannelMode.private,
      users: { user_id: user.id, type: ChannelRelationshipType.Invited },
    });

    // Can manage channel if owner
    can(ChannelAction.Manage, Channel, {
      users: {
        $elemMatch: { user_id: user.id, type: ChannelRelationshipType.Owner },
      },
    });

    // Can update channel if admin
    can(ChannelAction.Update, Channel, {
      users: {
        $elemMatch: { user_id: user.id, type: ChannelRelationshipType.Admin },
      },
    });

    // All members can speak
    can(ChannelAction.Speak, Channel, {
      users: {
        user_id: user.id,
      },
    });

    // Banned members can't join or speak
    cannot([ChannelAction.Join, ChannelAction.Speak], Channel, {
      users: {
        $elemMatch: { user_id: user.id, type: ChannelRelationshipType.Banned },
      },
    });

    // Muted members can't speak
    cannot(ChannelAction.Speak, Channel, {
      users: {
        $elemMatch: { user_id: user.id, type: ChannelRelationshipType.Muted },
      },
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
