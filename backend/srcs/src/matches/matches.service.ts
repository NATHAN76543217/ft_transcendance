import Match from './matches.entity';

import MatchNotFound from './exceptions/MatchNotFound.exception';

import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ChannelsService from 'src/channels/channels.service';
import { MatchesGateway } from './matches.gateway';
import { Room } from './room';
import { MessageType } from 'src/messages/message.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import UpdateMatchDto from './dto/updateMatch.dto';

@Injectable()
export default class MatchesService {
  private logger = new Logger('MatchesService');

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

  createMatchTest = async (
    id1: number,
    id2: number,
    sc1: number,
    sc2: number,
  ) => {
    const match = this.matchesRepository.create({
      player_ids: [id1, id2],
      scores: [sc1, sc2],
      startedAt: Date(),
      endAt: Date(),
    });
    this.matchesRepository.save(match);
    this.logger.debug(`getMatchesByPlayerId: ${JSON.stringify(match)}`);
  };

  deleteMatchTest = (id: number) => {
    this.matchesRepository.delete(id);
  };

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
    // this.deleteMatchTest(18);
    // this.createMatchTest(4, 3, 19, 8);

    // for (let i=48 ; i <= 54 ; i++) {this.deleteMatchTest(i);}

    // TODO: I think we can't call orderBy twice (one overrides the other)
    const matches = await this.matchesRepository
      .createQueryBuilder('match')
      .where('match.player_ids @> :playerId', { playerId: [playerId] })
      // .where('match.player_ids = :playerId', { playerId })
      .orderBy('match.startedAt', 'DESC')
      .take(count)
      .orderBy('match.startedAt', 'ASC')
      .getMany();

    return matches;
  }

  public async getCurrentMaches(): Promise<Match[]> {
    return this.matchesRepository
      .createQueryBuilder('match')
      .where('match.endAt IS NULL')
      .orderBy('match.startedAt', 'ASC')
      .getMany();
  }

  public async getCurrentMatchById(id: number) {
    const match = await this.matchesRepository.find({
      where: { id: id, endAt: undefined },
    });
    if (match) return match;
    throw new MatchNotFound(id);
  }

  public async updateMatch(id: number, match: UpdateMatchDto) {
    await this.matchesRepository.update(id, { player_ids: match.playerIds });
    const updatedMatch = this.getMatchById(id);
    if (updatedMatch) return updatedMatch;
    throw new MatchNotFound(id);
  }

  public async createMatch(
    hostId: number,
    match: CreateMatchDto,
    notInviteGuest?: true,
  ): Promise<Match> {
    const newMatch = await this.matchesRepository.save(
      this.matchesRepository.create({ player_ids: [hostId, ...match.guests] }),
    );

    Logger.debug(`Created match: ${JSON.stringify(newMatch)}}`);

    if (notInviteGuest === undefined) {
      match.guests.forEach((guestId) => {
        Logger.debug(`Inviting ${guestId}...`);
        this.channelsService.sendUserMessage(hostId, {
          channel_id: 1,
          type: MessageType.GameInvite,
          data: newMatch.id.toFixed(),
          receiver_id: guestId,
          sender_id: hostId,
        });
      });
    }

    const room : Room = new Room(this.matchesGateway, newMatch.id, hostId, match.ruleset);
    room.playerIds.push(hostId);
    match.guests.forEach((guestId) => {
      room.playerIds.push(guestId);
    });
    

    this.matchesGateway.setRoom(room);

    return newMatch;
  }

  public async deleteMatch(id: number) {
    try {
      const match = await this.getMatchById(id);
      this.logger.debug(`deleteMatch: ${JSON.stringify(match)}`);
      const deleteResponse = await this.matchesRepository.delete(id);
      if (!deleteResponse.affected) {
        throw new MatchNotFound(id);
      }
      // match.player_ids.forEach((player_id) => {
      //   this.logger.debug(`Deleting invitation ${player_id}...`);
      //   if (player_id !== match.player_ids[0]) {
      //     this.channelsService.sendUserMessage(match.player_ids[0], {
      //       channel_id: 1,
      //       type: MessageType.GameCancel,
      //       data: id.toFixed(),
      //       receiver_id: player_id,
      //       sender_id: match.player_ids[0],
      //     });
      //   }
      // });
    } catch (e) {
      throw new MatchNotFound(id);
    }
  }
}
