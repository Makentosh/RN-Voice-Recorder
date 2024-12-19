import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AudioRecordsListItemProps } from '@/components/types';
import { Audio } from 'expo-av';
import { IconButton } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import AudioRecordDropdownMenu from '@/components/AudioRecordsList/AudioRecordDropdownMenu';

const AudioRecordsListItem: FC<AudioRecordsListItemProps> = ({ audio }) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [soundObjects, setSoundObjects] = useState<Map<string, Audio.Sound>>(new Map());
  const [playbackPosition, setPlaybackPosition] = useState<Map<string, number>>(new Map());

  const playAudio = async (): Promise<void> => {

    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: audio.uri });

      //
      // if (!status?.isLoaded) {
      //   console.error('Аудіо не завантажено:', status);
      //   return;
      // }

      // Set the position if it's available (from previous pause)
      const position = playbackPosition.get(audio.uri);

      console.log(position, 'position');

      if ( position ) {
        await soundObject.setPositionAsync(position);
      }

      await soundObject.playAsync();

      setPlayingAudio(audio.uri);

      soundObject.setOnPlaybackStatusUpdate(async (status) => {
        if ( !status.isLoaded ) {
          console.error('Аудіо не завантажено або виникла помилка:', status);
          return;
        }

        if ( status.isPlaying ) {
          return;
        }
        // When the audio finishes playing
        setPlayingAudio(null);
        soundObject.unloadAsync();

        setPlaybackPosition((prev) => {
          prev.set(audio.uri, status.positionMillis); // Save the position

          return new Map(prev);
        });
      });

      // Store the sound object in the map
      setSoundObjects((prev) => new Map(prev.set(audio.uri, soundObject)));
    } catch ( error ) {
      console.error('Помилка відтворення:', error);
    }
  };

  const pauseAudio = async (): Promise<void> => {
    const soundObject = soundObjects.get(audio.uri);

    console.log('pause');

    if ( soundObject ) {
      //pause
      await soundObject.pauseAsync();
      setPlayingAudio(null);

      const status = await soundObject.getStatusAsync();

      if ( !status.isLoaded ) {
        console.error('Аудіо не зупинено або виникла помилка:', status);
        return;
      }

      console.info(status, 'status after pause')

      if ( status.positionMillis ) {
        setPlaybackPosition((prev) => {
          prev.set(audio.uri, status.positionMillis); // Save the position when paused
          return new Map(prev);
        });
      }
    }
  };


  return (
      <View style={ { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } }>

        <View style={ {} }>
          <IconButton icon={ playingAudio === audio.uri ? 'pause' : 'microphone' }
                      mode={ 'contained' }
                      onPress={ !playingAudio ? playAudio : pauseAudio }/>
        </View>

        <View style={ { display: 'flex', flexDirection: 'column', flexGrow: 1 } }>
          <View style={ { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' } }>
            <ThemedText>
              { audio.name }
            </ThemedText>
            <ThemedText>
              { audio.duration }
            </ThemedText>
          </View>

          <View style={ { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' } }>
            <ThemedText>{ audio.date }</ThemedText>
            <ThemedText>{ audio.fileSize } кб</ThemedText>
          </View>
        </View>

        <View>
          <AudioRecordDropdownMenu audio={ audio }/>
        </View>
      </View>
  );
};

export default AudioRecordsListItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
  },
});
