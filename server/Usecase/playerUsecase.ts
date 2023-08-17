import { playerRepository } from '$/Repository/playerRepository';
import type { UserId } from '$/commonTypesWithClient/branded';
import type { playerModel } from '$/commonTypesWithClient/models';
import { UserIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

export type MoveDirection = { x: number; y: number };

export const position: number[][] = [[50, 500]];
export let gunPosition: number[][] = [[]];

export const gunShot = async () => {
  console.log('gunShot動作');
  gunPosition.push([position[0][0] + 50, position[0][1] + 25]);
};
setInterval(() => {
  moveGun();
}, 5);

const moveGun = () => {
  const newGunPosition: number[][] = [];
  for (const s of gunPosition) {
    s[0] + 1 <= 1500 && newGunPosition.push([s[0] + 1, s[1]]);
  }
  gunPosition = newGunPosition;
  return gunPosition;
};

export const playerUsecase = {
  createNewPlayer: async () => {
    //playerの初期ステータス
    const new_player: playerModel = {
      userId: UserIdParser.parse(randomUUID()),
      pos: { x: 50, y: 300 },
      speed: 5,
      hp: 10,
      radius: 20,
      score: 0,
    };
    await playerRepository.save(new_player);
    return new_player.userId;
  },
  movePlayer: async (movedirection: MoveDirection, user_Id: UserId) => {
    // position[0][0] += movedirection.x * 10;
    // position[0][1] += movedirection.y * 10;
    const recentlyPlayerInfo = await playerRepository.read(user_Id);
    const updatePlayerInfo: playerModel = {
      userId: user_Id,
      pos: {
        x: (recentlyPlayerInfo.pos.x += movedirection.x * 10),
        y: (recentlyPlayerInfo.pos.y += movedirection.y * 10),
      },
      speed: recentlyPlayerInfo.speed,
      hp: recentlyPlayerInfo.hp,
      radius: recentlyPlayerInfo.radius,
      score: recentlyPlayerInfo.score,
    };
    await playerRepository.save(updatePlayerInfo);
  },

    getPlayerPos: async () => {
      return position;
    },
  };
})();
