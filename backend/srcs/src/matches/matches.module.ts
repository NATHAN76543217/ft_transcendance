import { Module } from '@nestjs/common';
import MatchesControler from './matches.controller';
import MatchesService from './matches.service';
import Match from './matches.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsModule } from 'src/channels/channels.module';
import { MatchesGateway } from './matches.gateway';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    AuthenticationModule,
    ChannelsModule,
  ],
  controllers: [MatchesControler],
  providers: [
    MatchesService,
    MatchesGateway,
    //PongGateway
  ],
  exports: [MatchesService],
})
export default class MatchesModule {}
