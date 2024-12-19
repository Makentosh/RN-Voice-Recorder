import { AudioFile } from '@/components/types';
import { create } from 'zustand';

type State = {
  records: AudioFile[] | []
}

type Actions = {
  setRecords: (records: AudioFile[]) => void
  setRecord: (records: AudioFile) => void
}

export const useRecordsStore = create<State & Actions>((set) => ({
  records: [],
  setRecords: (records: AudioFile[]) => set((state) => ({ ...state, records: [ ...records] })),
  setRecord: (record: AudioFile) => set((state) => ({ ...state, records: [...state.records, record] })),
}));
