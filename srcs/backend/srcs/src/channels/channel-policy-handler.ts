import { IPolicyHandler } from 'src/authorization/policies.guard';
import { ChannelAbility, ChannelAction } from './channel-casl-ability.factory';
import Channel from './channel.entity';

export class CreateChannelPolicyHandler
  implements IPolicyHandler<ChannelAbility>
{
  handle(ability: ChannelAbility): boolean {
    return ability.can(ChannelAction.Create, Channel);
  }
}

export class ReadChannelPolicyHandler
  implements IPolicyHandler<ChannelAbility>
{
  handle(ability: ChannelAbility): boolean {
    return ability.can(ChannelAction.Read, Channel);
  }
}

export class UpdateChannelPolicyHandler
  implements IPolicyHandler<ChannelAbility>
{
  handle(ability: ChannelAbility): boolean {
    return ability.can(ChannelAction.Update, Channel);
  }
}

export class DeleteChannelPolicyHandler
  implements IPolicyHandler<ChannelAbility>
{
  handle(ability: ChannelAbility): boolean {
    return ability.can(ChannelAction.Delete, Channel);
  }
}

export class JoinChannelPolicyHandler
  implements IPolicyHandler<ChannelAbility>
{
  handle(ability: ChannelAbility): boolean {
    return ability.can(ChannelAction.Join, Channel);
  }
}
