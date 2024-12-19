export type AudioFile = {
  name: string;
  uri: string;
  duration?: string;
  fileSize?: string | null
  date: string
};

export type RecordButtonProps = {
  setRecordingUri: (uri: string | null) => void
}

export type RecordFileTitleFormProps = {
  setRecordingUri: (uri: string | null) => void
  setAudioFiles: (file: AudioFile[]) => void
  recordingUri: string | null
}

export type AudioRecordsListProps = {
  audioFiles: AudioFile[]
}

export type AudioRecordsListItemProps = {
  audio: AudioFile
}
