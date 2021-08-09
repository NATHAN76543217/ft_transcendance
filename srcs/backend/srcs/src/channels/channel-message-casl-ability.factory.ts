import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { IChannelMessageAbilityFactory } from 'src/authorization/policies.guard';
import { UserRole } from 'src/users/utils/userRole';
import Channel from './channel.entity';
import ChannelRelationship from './relationships/channel-relationship.interface';
import { ChannelRelationshipType } from './relationships/channel-relationship.type';
import { ChannelMode } from './utils/channelModeTypes';

export enum ChannelMessageAction {
  Create = 'create',
  Read = 'read',
}

type Subjects = InferSubjects<typeof Channel | ChannelRelationship> | 'all';

export type ChannelAbility = Ability<[ChannelMessageAction, Subjects]>;

@Injectable()
export class ChannelMessageCaslAbilityFactory
  implements IChannelMessageAbilityFactory<ChannelAbility>
{
  createForChannelRelationship(relation: ChannelRelationship) {
    const { can, cannot, build } = new AbilityBuilder<ChannelAbility>(
      Ability as AbilityClass<ChannelAbility>,
    );

    if (relation.type &
      (ChannelRelationshipType.Admin |
        ChannelRelationshipType.Owner |
        ChannelRelationshipType.Member)) {
      // Members abilities
      can(ChannelMessageAction.Create, 'all');
      can(ChannelMessageAction.Read, 'all');
    }

    if (relation.type &
      ChannelRelationshipType.Muted) {
      // Muted abilities
      cannot(ChannelMessageAction.Create, 'all');
      can(ChannelMessageAction.Read, 'all');
    }

    if (relation.type &
      (ChannelRelationshipType.Banned |
        ChannelRelationshipType.Invited |
        ChannelRelationshipType.Null)) {
      // Non Members abilities
      cannot(ChannelMessageAction.Create, 'all');
      cannot(ChannelMessageAction.Read, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
