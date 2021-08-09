import { Ruleset } from "./Ruleset.dto";

export type CreateGameDto = {
  guests: number[];
  ruleset: Ruleset;
};
