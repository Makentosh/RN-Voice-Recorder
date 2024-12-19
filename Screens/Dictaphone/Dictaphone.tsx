import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioFile } from '@/components/types';
import RecordButton from '../../components/RecordButton';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';
import { useRecordsStore } from '@/store/recordsStore';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Dictaphone () {
  const setRecords = useRecordsStore(state => state.setRecords)
  const loadAudioFiles = async (): Promise<void> => {
    try {
      const files: AudioFile[] = JSON.parse(await AsyncStorage.getItem('audioFiles') || '[]');
      console.log(files, 'files here ?');
      setRecords(files);
    } catch ( error ) {
      console.error('Помилка завантаження файлів:', error);
    }
  };

  useEffect(() => {
    loadAudioFiles();
  }, []);


  return (
      <SafeAreaView style={ { ...styles.dictaphoneScreen } }>

        <RecordButton/>

      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dictaphoneScreen: {
    padding: 20,
    alignItems: 'center',
    height: '100%'
  }
});
