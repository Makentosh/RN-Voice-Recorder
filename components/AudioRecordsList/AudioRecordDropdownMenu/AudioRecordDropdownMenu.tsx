import React, { FC, useState } from 'react';
import { IconButton, Menu } from 'react-native-paper';
import { AudioFile } from '@/components/types';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecordsStore } from '@/store/recordsStore';


type AudioRecordDropdownMenuProps = {
  audio: AudioFile
}
const AudioRecordDropdownMenu: FC<AudioRecordDropdownMenuProps> = ({ audio }) => {
  const setRecords = useRecordsStore(state => state.setRecords);
  const records = useRecordsStore(state => state.records);
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const shareFile = async () => {
    if ( await Sharing.isAvailableAsync() ) {
      try {
        await Sharing.shareAsync(audio.uri);
        console.log('Файл надіслано:', audio.uri);
      } catch ( error ) {
        console.error('Помилка поділу файлу:', error);
      } finally {
        closeMenu();
      }
    } else {
      console.log('Поділ файлу не доступний на цьому пристрої');
      closeMenu();
    }
  };

  const deleteAudio = async (): Promise<void> => {
    try {
      await FileSystem.deleteAsync(audio.uri);
      const updatedFiles = records.filter((file) => file.uri !== audio.uri);
      await AsyncStorage.setItem('audioFiles', JSON.stringify(updatedFiles));
      setRecords(updatedFiles);
      console.log('Файл видалено:', audio.uri);
    } catch ( error ) {
      console.error('Помилка видалення файлу:', error);
    }
  };

  return (
      <Menu
          visible={ visible }
          onDismiss={ closeMenu }
          anchor={ <IconButton
              icon="dots-vertical"
              onPress={ openMenu }
          >
          </IconButton> }>
        <Menu.Item leadingIcon={ 'pencil-outline' }
                   onPress={ () => {} }
                   title="Перейменувати"/>
        <Menu.Item leadingIcon={ 'share-variant-outline' }
                   onPress={ shareFile }
                   title="Поділитися"/>
        <Menu.Item leadingIcon={ 'delete-outline' }
                   onPress={ deleteAudio }
                   title="Видалити"/>
        <Menu.Item leadingIcon={ 'open-in-new' }
                   onPress={ () => {} }
                   title="Відкрити за допомогою"/>
      </Menu>
  );
};

export default AudioRecordDropdownMenu;
