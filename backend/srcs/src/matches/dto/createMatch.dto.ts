import { Ruleset } from './ruleset.dto';

export type CreateMatchDto = {
  guests: number[];
  ruleset: Ruleset;
  startedAt?: Date;
};
