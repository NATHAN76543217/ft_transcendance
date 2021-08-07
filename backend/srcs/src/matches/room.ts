import { Inject, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { PlayerStatus } from './dto/playerStatus';
import { Ruleset } from './dto/ruleset.dto';
import { MatchesGateway, defaultRuleset } from './matches.gateway';
import { Ball, defaultBall } from './models/Ball';
import { canvasDims, canvasPadding } from './models/canvasDims';
import { GameRoom, GameState, GameStatus } from './models/GameRoom';
import { Side, PLAYER_WIDTH, Player } from './models/Player';
import { Vector2D } from './models/Vector2D';
import { pongEngine } from './pongEngine';

export class Room implements GameRoom {
  public lastRunning?: number;
  private engineIntervalHandle: NodeJS.Timeout;
  private updateIntervalHandle: NodeJS.Timeout;
  private endTimeoutHandle: NodeJS.Timeout;

  ruleset: Ruleset;
  playerIds: number[] = [];
  filled: boolean = false;
  level?: number;

  state: GameState = {
    /** Elapsed time in ms */
    elapsed: 0,
    status: GameStatus.UNREADY,
    players: new Map(),
    scores: [0, 0],
    ball: new Ball(
      {
        x: defaultBall.x,
        y:defaultBall.y
      },
      {
        x: defaultBall.dir.x,
        y: defaultBall.dir.y
      },
      defaultBall.velocity,
      defaultBall.rad
    )
  };

  constructor(
    @Inject()
    public matchesGateway: MatchesGateway,
    public matchId: number,
    public hostId: number,
    ruleset?: Ruleset,
  ) {
    this.ruleset = { ...defaultRuleset, ...ruleset };
    this.addPlayer(hostId);

    this.onGameRunning = this.onGameRunning.bind(this);
  }
  getId() {
    return this.matchId.toFixed();
  }

  addPlayer(playerId: number) {
    const pos = this.state.players.size;
    const side: Side = pos % 2 === 0 ? 'left' : 'right';
    const teamSize = this.ruleset.size / 2;
    const teamPos = pos > teamSize ? pos - teamSize : teamSize;
    const playerY = (canvasDims.y / teamSize) * teamPos;
    const playerX =
      side === 'left'
        ? canvasPadding
        : canvasDims.x - canvasPadding - PLAYER_WIDTH;

    this.state.players.set(
      playerId,
      new Player(
        { x: playerX, y: playerY },
        side,
        PlayerStatus.UNREADY,
        playerId,
      ),
    );

    //Logger.debug(`[ROOM ------>] Add player ${playerId} side: ${side} pos: ${pos}`);
  }

  // TODO: Replace with setPlayerStatus (DISCONNECTED)
  removePlayer(playerId: number) {
    if (this.state.players.has(playerId)) {
      this.state.players.delete(playerId);

      if (this.state.status === GameStatus.RUNNING)
        this.setStatus(GameStatus.PAUSED);
      else if (this.state.status !== GameStatus.UNREADY)
        this.setStatus(GameStatus.UNREADY);
    }
  }

  setStatus(status: GameStatus) {
    this.state.status = status;
    if (status === GameStatus.RUNNING) {
      this.onStartGame();
    } else if (status === GameStatus.FINISHED) {
      this.onGameFinished();
    } else {
      this.onGameStopped();
    }
  }

  invitePlayer(playerId: number) {
    if (!this.isFilled()) this.playerIds.push(playerId);
  }

  getPlayer(id: number) {
    const player = this.state.players.get(id);

    if (player === undefined) throw new WsException('Room not found');
    return player;
  }

  setScoreAfterGiveUp(userId: number) {
    this.state.players.forEach(async (player) => {
      const index = !player.side.localeCompare('left') ? 0 : 1;
      if (player.id === userId) {
        this.state.scores[index] = -1;
      } else {
        this.state.scores[index] = this.ruleset.rounds;
      }
    })
  }

  setPlayerStatus(userId: number, status: PlayerStatus) {
    const player = this.getPlayer(userId);
    player.status = status;

    if (status === PlayerStatus.GIVEUP) {
      this.setScoreAfterGiveUp(userId);
    }

    const gameStatus = this.state.status;

    const isReady = status === PlayerStatus.READY && this.playersReady();
    const isRunning =
      status === PlayerStatus.CONNECTED && this.playersConnected();
    const hasGivenUp = 
    status === PlayerStatus.GIVEUP && this.playersGiveUp();

    switch (gameStatus) {
      case GameStatus.UNREADY:
        if (!isReady) this.setStatus(GameStatus.UNREADY);
      case GameStatus.STARTING:
        if (!isReady) this.setStatus(GameStatus.UNREADY);
        break;
      case GameStatus.RUNNING:
        if (!isRunning && !hasGivenUp) this.setStatus(GameStatus.PAUSED);
        break;
      case GameStatus.PAUSED:
        if (isRunning) this.setStatus(GameStatus.RUNNING);
        break;
      default:
        break;
    }
  }

  setMousePos(playerId: number, mousePos: Vector2D) {
    const player = this.getPlayer(playerId);
    if (this.ruleset.size == 4)
    {
      const index = this.playerIds.findIndex(id => id === playerId);
      if (index === -1)
        throw new Error();
      if (index === 0 || index == 2) {
        player.y = (canvasDims.y / 2) - (player.height / 2) ? (canvasDims.y / 2) - (player.height / 2) : player.y;
      } else {
        player.y = (canvasDims.y / 2) + (player.height / 2) ? (canvasDims.y / 2) + (player.height / 2) : player.y;
      }
    }
    player.y = mousePos.y;
  }

  getPlayerPos(playerId: number) {
    const mousePos: Vector2D = this.state.players.get(playerId);
    if (mousePos === undefined) throw new Error();
    return mousePos;
  }

  public isFilled() {
    return this.playerIds.length >= this.ruleset.size;
  }

  public playersReady() {
    let ready = true;

    this.state.players.forEach((player) => {
      if (player.status !== PlayerStatus.READY) ready = false;
    });
    return ready;
  }

  public playersConnected() {
    let running = true;
    this.state.players.forEach((player) => {
      if (player.status !== PlayerStatus.CONNECTED && player.status !== PlayerStatus.GIVEUP) running = false;
    });
    return running;
  }

  public playersGiveUp() {
    let givenUp = false;

    this.state.players.forEach((player) => {
      if (player.status === PlayerStatus.GIVEUP) givenUp = true;
    });
    return givenUp;
  }

  onStartGame() {
    this.state.status = GameStatus.RUNNING;//GameStatus.STARTING; // TO DO: Staus === STARTING when not all the player have joined, here all the players have joined

    this.matchesGateway.onGameUpdate(this.matchId, this.state);
    setTimeout(this.onGameRunning, 3 * 1000);
  }

  private DEBUG(n: number, msg: string) {
    Logger.debug(`[DEBUG] ${msg} ${n}`);
    return n;
  }

  onGameRunning() {
    this.state.elapsed = 0;
    if (this.state.status === GameStatus.RUNNING) {
      this.matchesGateway.onClientStartGame(this.matchId);

      const t = 45;

      this.lastRunning = Date.now();

      this.engineIntervalHandle = setInterval(() => {
        pongEngine(this.state, this.ruleset.speedMode, this.ruleset.downsize);
        if (
          this.state.scores[0] >= this.ruleset.rounds ||
          this.state.scores[1] >= this.ruleset.rounds
        ) {
          Logger.debug(`[MATCHES GATEWAY] Game has finished: by round max`);
          this.setStatus(GameStatus.FINISHED);
          Logger.debug(`[MATCHES GATEWAY] Clear interval ${this.engineIntervalHandle}`);
          clearInterval(this.engineIntervalHandle);
          clearInterval(this.updateIntervalHandle);
          clearTimeout(this.endTimeoutHandle);
        }
      }, this.DEBUG( t / 3, `Engine Interval: ${this.engineIntervalHandle}`));

      this.updateIntervalHandle = setInterval(() => {
        this.matchesGateway.onGameUpdate(this.matchId, this.state);
      }, this.DEBUG( t, `Update Interval: ${this.updateIntervalHandle}`)); // TO DO: Read doc for times

      this.endTimeoutHandle = setTimeout(() => {
        Logger.debug(`[MATCHES GATEWAY] Game has finished by timeout: ${this.state.elapsed} seconds`);
        this.setStatus(GameStatus.FINISHED);
        // this.onGameFinished();
        clearInterval(this.engineIntervalHandle);
        clearInterval(this.updateIntervalHandle);

      }, this.DEBUG((this.ruleset.duration - this.state.elapsed) * 60, "timeout for end the game is") * 1000);
    }
  }

  onGameStopped() {
    const current = Date.now();

    this.state.elapsed += current - this.lastRunning;

    this.matchesGateway.onGameUpdate(this.matchId, this.state);
    clearInterval(this.engineIntervalHandle);
    clearInterval(this.updateIntervalHandle);
    clearTimeout(this.endTimeoutHandle);

    Logger.debug("[MATCHES GATEWAY] on game stopped has been called");
    //this.matchesGateway.onDisconnectClients(this.matchId); // TO DO: Why this was here ?
  }

  onGameFinished() {
    Logger.debug("[PONG GATEWAY] on Disconnect Clients");
    this.matchesGateway.onGameUpdate(this.matchId, this.state);
    this.matchesGateway.onDisconnectClients(this.matchId);
  }
}
