export enum ChannelMode {
  public = 1,
  protected = 2,
  private = 4,
}

export type Channel = {
  id: number;

  name: string;

  mode: ChannelMode;

  // messages: Message[];

  // users: User[];
};
