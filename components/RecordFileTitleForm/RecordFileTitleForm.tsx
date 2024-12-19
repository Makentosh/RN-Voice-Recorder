import React, { FC, memo, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AudioFile, RecordFileTitleFormProps } from '@/components/types';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const RecordFileTitleForm: FC<RecordFileTitleFormProps> = ({ setRecordingUri, setAudioFiles, recordingUri }) => {
  const [fileName, setFileName] = useState<string>('');
  const saveRecording = async (): Promise<void> => {
    if ( Platform.OS === 'web' ) {
      Alert.alert('Помилка', 'Збереження файлів не підтримується на веб-платформі.');
      setRecordingUri(null);
      setFileName('');
      return;
    }

    if ( !fileName.trim() ) {
      Alert.alert('Помилка', 'Введіть назву файлу.');
      return;
    }

    try {
      const uniqueFileName = `${ fileName.trim() }-${ Date.now() }.m4a`;
      const fileUri = `${ FileSystem.documentDirectory }${ uniqueFileName }`;

      if ( recordingUri ) {
        await FileSystem.moveAsync({
          from: recordingUri,
          to: fileUri,
        });

        const currentFiles: AudioFile[] = JSON.parse(await AsyncStorage.getItem('audioFiles') || '[]');
        const updatedFiles = [...currentFiles, { name: fileName.trim(), uri: fileUri }];

        await AsyncStorage.setItem('audioFiles', JSON.stringify(updatedFiles));
        setAudioFiles(updatedFiles);

        setRecordingUri(null);
        setFileName('');
        console.log('Файл збережено:', fileUri);
      }
    } catch ( error ) {
      console.error('Помилка збереження файлу:', error);
    }
  };

  return (
      <View style={ styles.formWrapper }>
        <TextInput
            value={ fileName }
            onChangeText={ setFileName }
            placeholder="Назва файлу"
            style={ styles.input }
        />
        <Pressable style={ styles.button }
                   onPress={ saveRecording }>
          <FontAwesome name="save"
                       size={ 24 }
                       color="black"/>
        </Pressable>
      </View>
  );
};

export default memo(RecordFileTitleForm);

const styles = StyleSheet.create({
  formWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
    marginBottom: 20
  },
  button: {
    padding: 6,
    borderRadius: '50%',
    borderStyle: 'solid',
    borderColor: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flexGrow: 1
  }
});
