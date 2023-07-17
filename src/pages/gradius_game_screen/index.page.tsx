//ここにゲーム画面をつくる
import { useEffect, useState } from 'react';
import { Layer, Rect, Stage, Wedge } from 'react-konva';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import styles from './gradius_game_screen.module.css';
// import enemy01 from '../../../public/images/enemy01.png';
// import fighter from '../../../public/images/fighter.png';

const App = () => {
  const [fight_position, setfight_position] = useState<number[]>();
  const [enemies, setenemies] = useState<number[][]>([]);
  const [laser_pos, setlaser_pos] = useState<number[][]>([]);
  const [background_pos, setbackground_pos] = useState(0);

  const fetchBord = async () => {
    const new_fighter_position = await apiClient.player.$get();
    const new_enemy_pos = await apiClient.enemy.$get();
    const new_laser_pos = await apiClient.laser.$get();
    // console.log(new_laser_pos);
    setfight_position(new_fighter_position);
    setenemies(new_enemy_pos);
    setlaser_pos(new_laser_pos);
    setbackground_pos((pre_background_pos) => pre_background_pos - 1);
  };
  console.log(laser_pos);
  useEffect(() => {
    const cancellid = setInterval(fetchBord, 100);
    return () => {
      clearInterval(cancellid);
    };
  }, []);

  //localhost:3000/gradius_game_screen/
  if (!fight_position) return <Loading visible />;
  return (
    <Stage
      width={1280}
      height={780}
      className={styles.container}
      style={{ backgroundPosition: `${background_pos}px 0` }}
    >
      <Layer>
        <Wedge
          id="player"
          fill="red"
          angle={60}
          radius={70}
          rotation={150}
          x={fight_position[0]}
          y={fight_position[1]}
        />
        {enemies.map((enemy, index) => (
          <Rect
            key={index}
            id={`enemy_${index}`}
            fill="white"
            width={40}
            height={40}
            x={enemy[0]}
            y={enemy[1]}
          />
        ))}
        {laser_pos.map((laser, index) => (
          <Rect
            key={index}
            id={`laser_${index}`}
            fill="blue"
            width={20}
            height={20}
            x={laser[0]}
            y={laser[1]}
          />
        ))}
      </Layer>
    </Stage>
  );
};
export default App;
