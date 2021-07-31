import Match from './matches.entity';

import MatchNotFound from './exceptions/MatchNotFound.exception';
import CurrMatchesNotFound from './exceptions/CurrMatchesNotFound.exception';

import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ChannelsService from 'src/channels/channels.service';
import { MatchesGateway } from './matches.gateway';
import { Room } from './room';
import { MessageType } from 'src/messages/message.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import UpdateMatchDto from './dto/updateMatch.dto';
import UsersService from 'src/users/users.service';

@Injectable()
export default class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private channelsService: ChannelsService,
    @Inject(forwardRef(() => MatchesGateway))
    private matchesGateway: MatchesGateway,
  ) { }

  public async getAllMatches(): Promise<Match[]> {
    const matches = await this.matchesRepository.find();
    return matches;
  }

  createMatchTest = async (id1: number, id2: number, sc1: number, sc2: number) => {
    const match = this.matchesRepository.create({
      player_ids: [id1, id2],
      scores: [sc1, sc2],
      startedAt: Date(),
      endAt: Date()
    });
    this.matchesRepository.save(match);
    console.log('getMatchesByPlayerId', match)
  }

  deleteMatchTest = (id: number) => {
    this.matchesRepository.delete(id)
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

    // this.deleteMatchTest(18);
    // this.createMatchTest(4, 3, 19, 8);
    
    // for (let i=48 ; i <= 54 ; i++) {this.deleteMatchTest(i);}

    
    const matches =  await this.matchesRepository
      .createQueryBuilder('match')
      .where('match.player_ids @> :playerId', { playerId: [playerId] })
      // .where('match.player_ids = :playerId', { playerId })
      .orderBy('match.startedAt', 'DESC')
      .take(count)
      .orderBy('match.startedAt', 'ASC')
      .getMany()

      return matches
  }

  public async getCurrentMaches(): Promise<Match[]> {
    return this.matchesRepository
      .createQueryBuilder('match')
      .where('match.endAt IS NULL')
      .orderBy('match.startedAt', 'ASC')
      .getMany();

    // const currMatches = await this.matchesRepository.find({
    //   where: { endAt: undefined },
    // });
    // if (currMatches) return currMatches;
    // throw new CurrMatchesNotFound();
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
      this.matchesRepository.create({player_ids: [hostId, ...match.guests]}),
    );

    Logger.debug(`Created match: ${JSON.stringify(newMatch)}}`);

    match.guests.forEach((guestId) => {
      Logger.debug(`Inviting ${guestId}...`);
      this.channelsService.sendUserMessage(hostId, {
        channel_id: 1,
        type: MessageType.GameInvite,
        data: newMatch.id.toFixed(),
        receiver_id: guestId,
        sender_id: hostId
      });
    });

    this.matchesGateway.setRoom(
      new Room(this.matchesGateway, newMatch.id, hostId, match.ruleset),
    );

    return newMatch;
  }

  public async deleteMatch(id: number) {
    try {
      const match = await this.getMatchById(id);
      console.log('match to delete', match)
      const deleteResponse = await this.matchesRepository.delete(id);
      if (!deleteResponse.affected) {
        throw new MatchNotFound(id);
      }
      match.player_ids.forEach((player_id) => {
        Logger.debug(`Deleting invitation ${player_id}...`);
        if (player_id !== match.player_ids[0]) {
          this.channelsService.sendUserMessage(match.player_ids[0], {
            channel_id: 1,
            type: MessageType.GameCancel,
            data: id.toFixed(),
            receiver_id: player_id,
            sender_id: match.player_ids[0]
          });
        }
      });
    } catch (e) {
      console.log(e)
      throw new MatchNotFound(id);
    }
  }
}
