import type { Player } from '@prisma/client';
import { z } from 'zod';
import type { UserId } from '../commonTypesWithClient/branded';
import type { PlayerModel } from '../commonTypesWithClient/models';
import { userIdParser } from '../service/idParsers';
import { prismaClient } from '../service/prismaClient';

const toPlayerModel = (prismaPlayer: Player): PlayerModel => ({
  id: userIdParser.parse(prismaPlayer.userId),
  name: z.string().parse(prismaPlayer.name),
  score: z.number().parse(prismaPlayer.score),
  pos: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .parse({
      x: prismaPlayer.x,
      y: prismaPlayer.y,
    }),
  Items:
    z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .array()
      .nullable()
      .parse(prismaPlayer.Item) ?? undefined,
  side: z.enum(['left', 'right']).parse(prismaPlayer.side),
  isPlaying: z.boolean().parse(prismaPlayer.isPlaying),
  speed: z.number().min(0).parse(prismaPlayer.speed),
  startedAt: prismaPlayer.startedAt.getTime(),
  usingItem: z.string().nullable().parse(prismaPlayer.usingItem),
});

export const playerRepository = {
  save: async (player: PlayerModel): Promise<PlayerModel> => {
    const prismaPlayer = await prismaClient.player.upsert({
      where: {
        userId: player.id,
      },
      update: {
        score: player.score,
        Item: player.Items,
        x: player.pos.x,
        y: player.pos.y,
        isPlaying: player.isPlaying,
        speed: player.speed,
        usingItem: player.usingItem,
      },
      create: {
        userId: player.id,
        name: player.name,
        score: player.score,
        Item: player.Items,
        x: player.pos.x,
        y: player.pos.y,
        side: player.side,
        isPlaying: player.isPlaying,
        speed: player.speed,
        startedAt: new Date(player.startedAt),
        usingItem: player.usingItem,
      },
    });

    return toPlayerModel(prismaPlayer);
  },
  saveScore: async (playerId: UserId, score: number) => {
    const prismaPlayer = await prismaClient.player.update({
      where: {
        userId: playerId,
      },
      data: {
        score,
      },
    });

    return toPlayerModel(prismaPlayer);
  },
  saveItem: async (
    playerId: UserId,
    Item: {
      id: string;
      name: string;
    }[]
  ) => {
    const prismaPlayer = await prismaClient.player.update({
      where: {
        userId: playerId,
      },
      data: {
        Item,
      },
    });

    return toPlayerModel(prismaPlayer);
  },

  find: async (userId: UserId): Promise<PlayerModel | null> => {
    const player = await prismaClient.player.findUnique({
      where: {
        userId,
      },
    });
    return player !== null ? toPlayerModel(player) : null;
  },

  findAll: async (): Promise<PlayerModel[]> => {
    const players = await prismaClient.player.findMany();
    return players.map(toPlayerModel);
  },

  findPlayingOrDead: async (isPlaying: boolean): Promise<PlayerModel[]> => {
    const players = await prismaClient.player.findMany({
      where: {
        isPlaying,
      },
    });

    return players.map(toPlayerModel);
  },

  delete: async (userId: UserId) => {
    await prismaClient.player.deleteMany({
      where: {
        userId,
      },
    });
  },

  count: async () => {
    const count = await prismaClient.player.count();
    return count;
  },

  countInSide: async (side: 'left' | 'right') => {
    const count = await prismaClient.player.count({
      where: { side },
    });
    return count;
  },
};
