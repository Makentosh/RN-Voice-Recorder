import { Alert, StyleSheet, View } from 'react-native';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { normalizeMetering } from '@/helpers/normalizeTemering';
import { useRecordsStore } from '@/store/recordsStore';
import * as FileSystem from 'expo-file-system';
import { AudioFile } from '@/components/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { getAudioFileSizeInKB } from '@/helpers/getAudioFileSize';
import { getFormattedDate } from '@/helpers/getFormattedDate';

const getFileNameProps = () => {
  const date = new Date();

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    seconds: date.getSeconds()
  };
};

const RecordButton: FC = () => {
  const colorScheme = useColorScheme();
  const setRecord = useRecordsStore(state => state.setRecord);
  const setRecords = useRecordsStore(state => state.setRecords);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const [recordingDuration, setRecordingDuration] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const [amplitude, setAmplitude] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);

  const [customFileName, setFileName] = useState<string>('');


  const startRecording = async (): Promise<void> => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if ( permission.status !== 'granted' ) {
        Alert.alert('Помилка', 'Дозвіл на запис не надано.');
        return;
      }

      // Запуск таймера
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1); // Оновлення часу запису
      }, 1000) as unknown as number;

      // Запуск таймера для оновлення амплітуди
      timerRef.current = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if ( status.metering ) {
          if ( status.metering ) {
            const normalized = normalizeMetering(status.metering);
            setAmplitude((prev) => [...prev.slice(-50), normalized]); // Зберігаємо останні 50 значень
          }
        }
      }, 100) as unknown as number;

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);

      // Створюємо кастомне ім'я файлу
      const { year, month, day, hour, minute, seconds } = getFileNameProps();

      const customFileName = `${ year }_${ month }_${ day }_${ hour }_${ minute }_${ seconds }.m4a`;
      setFileName(customFileName); // Зберігаємо ім'я файлу

      console.log(customFileName, 'customFileName');

      console.log('Запис розпочато');
    } catch ( error ) {
      console.error('Помилка початку запису:', error);
    }
  };

  const stopRecording = async (): Promise<void> => {
    try {
      if ( recording ) {

        const { isRecording, durationMillis } = await recording.getStatusAsync();

        if ( isRecording ) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();


          if ( intervalRef.current !== null ) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          if ( timerRef.current !== null ) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          try {
            const uniqueFileName = `${ customFileName }`;
            const fileUri = `${ FileSystem.documentDirectory }${ uniqueFileName }`;

            const durationSeconds = Math.round((durationMillis || 0) / 1000);

            const newFile = {
              name: customFileName,
              uri: fileUri as string,
              duration: `${ Math.floor(durationSeconds / 60) }:${ (durationSeconds % 60).toString().padStart(2, '0') }`,
              fileSize: uri ? await getAudioFileSizeInKB(uri) : null,
              date: getFormattedDate
            };


            setRecord(newFile);

            if ( uri ) {
              await FileSystem.moveAsync({
                from: uri,
                to: fileUri,
              });

              const currentFiles: AudioFile[] = JSON.parse(await AsyncStorage.getItem('audioFiles') || '[]');
              const updatedFiles = [...currentFiles, newFile];

              await AsyncStorage.setItem('audioFiles', JSON.stringify(updatedFiles));
              setRecords(updatedFiles);

              setRecording(null);
              setFileName('');
              console.log('Файл збережено:', fileUri);
            }
          } catch ( error ) {
            console.error('Помилка збереження файлу:', error);
          }

          console.log('Запис завершено:', uri);
        } else {
          console.log(recording, 'if stopped');
          setRecording(null);
          console.log('Запис вже зупинено');
        }
      }
    } catch ( error ) {
      console.error('Помилка зупинки запису:', error);
    } finally {
      setRecording(null);
      setRecordingDuration(0);
      setAmplitude([]);
      setFileName('');
    }
  };

  useEffect(() => {
    return () => {
      if ( intervalRef.current !== null ) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
      <>
        <ThemedView style={ { ...styles.soundBar } }
                    lightColor={ 'rgba(0,0,0, .3)' }
                    darkColor={ 'rgba(255, 255, 255, .5)' }>
          <View style={ styles.visualizerContainer }>
            { amplitude.map((value, index) => (
                <View
                    key={ index }
                    style={ {
                      width: 4,
                      height: value,
                      backgroundColor: Colors.light.primary,
                      marginRight: 2,
                    } }
                />
            )) }
          </View>
        </ThemedView>

        <ThemedView style={ { ...styles.recordTime } }>
          <ThemedText>
            { Math.floor(recordingDuration / 60) }:
            { (recordingDuration % 60).toString().padStart(2, '0') }
          </ThemedText>
        </ThemedView>

        <IconButton
            style={ { ...styles.button } }
            icon={ !recording ? 'play' : 'stop' }
            size={ 50 }
            mode={ 'contained-tonal' }
            onPress={ recording ? stopRecording : startRecording }
        />
      </>


  );
};

export default memo(RecordButton);

const styles = StyleSheet.create({
  button: {
    flexShrink: 1
  },
  recordTime: {
    marginTop: 10,
    marginBottom: 10
  },
  soundBar: {
    borderRadius: 12,
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  visualizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
});
