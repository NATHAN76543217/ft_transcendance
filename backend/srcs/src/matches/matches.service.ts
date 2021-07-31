import Match from './matches.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import UpdateMatchDto from './dto/updateMatch.dto';

import MatchNotFound from './exceptions/MatchNotFound.exception';
import CurrMatchesNotFound from './exceptions/CurrMatchesNotFound.exception';

import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageType } from 'src/messages/message.entity';
import ChannelsService from 'src/channels/channels.service';
import { MatchesGateway } from './matches.gateway';
import { Room } from './room';

@Injectable()
export default class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private channelsService: ChannelsService,
    @Inject(forwardRef(() => MatchesGateway))
    private matchesGateway: MatchesGateway,
  ) {}

  public async getAllMatches(): Promise<Match[]> {
    const matches = await this.matchesRepository.find();
    return matches;
  }

  public async getMatchById(id: number): Promise<Match> {
    const match = await this.matchesRepository.findOne(id);
    if (match) return match;
    throw new MatchNotFound(id); // TODO
  }

  // TO DO: Weird code
  public async getMatchesByPlayerId(
    playerId: number,
    count = 5,
  ): Promise<Match[]> {
    return this.matchesRepository
      .createQueryBuilder('match')
      .where('match.player_ids @> :playerId', { playerId })
      .orderBy('match.startedAt')
      .take(count)
      .getMany();
  }

  public async getCurrentMaches(): Promise<Match[]> {
    const currMatches = await this.matchesRepository.find({
      where: { endAt: undefined },
    });
    if (currMatches) return currMatches;
    throw new CurrMatchesNotFound();
  }

  public async getCurrentMatchById(id: number) {
    const match = await this.matchesRepository.find({
      where: { id: id, endAt: undefined },
    });
    if (match) return match;
    throw new MatchNotFound(id);
  }

  /*  public async updateMatchElement(id: string, key: string, value: unknown) {
    // TO DO: This implementation seems nice but breaks constness
    //let match = this.getMatchById(id);
    //match[key as keyof Promise<Match>] = value;

    // This C style implementation does also the work: ...
    const match = this.getMatchById(id);
    switch (key) {
      case 'scorePlayerOne': {
        (await match).scorePlayerOne = value as number;
        break;
      }
      case 'scorePlayerTwo': {
        (await match).scorePlayerTwo = value as number;
        break;
      }
      case 'endTime': {
        (await match).endAt = value as Date;
        break;
      }
      default: {
        throw new DevWrongKeyGiven(key);
      }
    }
  } */

  public async updateMatch(id: number, match: UpdateMatchDto) {
    await this.matchesRepository.update(id, { player_ids: match.playerIds });
    const updatedMatch = this.getMatchById(id);
    if (updatedMatch) return updatedMatch;
    throw new MatchNotFound(id);
  }

  public async createMatch(
    hostId: number,
    match: CreateMatchDto,
  ): Promise<Match> {
    const newMatch = await this.matchesRepository.save(
      this.matchesRepository.create({}),
    );

    Logger.debug(`Created match: ${JSON.stringify(newMatch)}}`);

    match.guests.forEach((guestId) => {
      Logger.debug(`Inviting ${guestId}...`);
      this.channelsService.sendUserMessage(hostId, {
        type: MessageType.GameInvite,
        data: newMatch.id.toFixed(),
        receiver_id: guestId,
      });
    });

    this.matchesGateway.setRoom(
      new Room(this.matchesGateway, newMatch.id, hostId, match.ruleset),
    );

    return newMatch;
  }

  public async deleteMatch(id: number) {
    const deleteResponse = await this.matchesRepository.delete(id);
    if (!deleteResponse.affected) throw new MatchNotFound(id);
  }
}
