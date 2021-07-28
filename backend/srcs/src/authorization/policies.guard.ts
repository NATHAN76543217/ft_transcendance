import { Ability } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import ChannelRelationship from 'src/channels/relationships/channel-relationship.entity';
import User from 'src/users/user.entity';

export interface IAbilityFactory<T extends Ability> {
  createForUser(user: User): T;
}
export interface IChannelMessageAbilityFactory<T extends Ability> {
  createForChannelRelationship(relation: ChannelRelationship): T;
}

export interface IPolicyHandler<T extends Ability> {
  handle(ability: T, id?: number): boolean;
}

type PolicyHandlerCallback<T extends Ability> = (ability: T) => boolean;

export type PolicyHandler<T extends Ability> =
  | IPolicyHandler<T>
  | PolicyHandlerCallback<T>;

export const CHECK_POLICIES_KEY = 'check_policy';

export const CheckPolicies = <T extends Ability>(
  ...handlers: PolicyHandler<T>[]
) => SetMetadata(CHECK_POLICIES_KEY, handlers);

@Injectable()
export class PoliciesGuard<T extends Ability> implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: IAbilityFactory<T>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler<T>[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest() as RequestWithUser;
    const ability = this.abilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler<T>, ability: T) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
