import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { AudioRecordsListProps } from '@/components/types';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AudioRecordsListItem from '@/components/AudioRecordsList/AudioRecordsListItem';


const AudioRecordsList: FC<AudioRecordsListProps> = ({ audioFiles }) => {
  return (
      <ThemedView style={ { ...styles.container } }>
        <ThemedText style={ styles.header }>Записані аудіо</ThemedText>

        <View style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          { audioFiles.map((file, index) => (
              <AudioRecordsListItem audio={ file }
                                    key={ index + file.uri }/>
          )) }
        </View>
      </ThemedView>
  );
};

export default AudioRecordsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white'
  },
});
