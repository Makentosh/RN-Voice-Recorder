import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { Dictaphone, Player } from '@/Screens';

export default function Index () {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'dictaphone', title: 'Диктофон', focusedIcon: 'microphone' },
    { key: 'player', title: 'Програвач', focusedIcon: 'headphones' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dictaphone: Dictaphone,
    player: Player,
  });

  return (
      <BottomNavigation
          navigationState={ { index, routes } }
          onIndexChange={ setIndex }
          renderScene={ renderScene }
      />
  );
}
