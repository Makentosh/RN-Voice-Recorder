import * as FileSystem from 'expo-file-system';

export const getAudioFileSizeInKB = async (uri: string): Promise<string | null> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (fileInfo.exists && fileInfo.size !== undefined) {
      // Розмір у кілобайтах
      return (fileInfo.size / 1024).toFixed(2);
    } else {
      console.error('Файл не існує або розмір невідомий');
      return null;
    }
  } catch (error) {
    console.error('Помилка отримання інформації про файл:', error);
    return null;
  }
};
