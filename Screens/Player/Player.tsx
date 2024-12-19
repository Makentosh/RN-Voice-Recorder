import { useRecordsStore } from '@/store/recordsStore';
import AudioRecordsList from '@/components/AudioRecordsList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

export default function Player () {
  const records = useRecordsStore(state => state.records);
  console.log(records, 'records ???');

  return (
      <SafeAreaView style={ {
        paddingVertical: 10,
        height: '100%',
      } }>
        <ScrollView>
          { records.length > 0 && <AudioRecordsList audioFiles={ records }/> }
        </ScrollView>

      </SafeAreaView>
  );
}
