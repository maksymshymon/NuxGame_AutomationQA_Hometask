export interface InterfaceLanguage {
  code: string;
  autonym: string;
  preferencesHeading: string;
  userProfileTab: string;
  internationalisationSection: string;
  saveButton: string;
  readTab: string;
  talkTab: string;
  historyTab: string;
}

export const ENGLISH: InterfaceLanguage = {
  code: 'en',
  autonym: 'English',
  preferencesHeading: 'Preferences',
  userProfileTab: 'User profile',
  internationalisationSection: 'Internationalisation',
  saveButton: 'Save',
  readTab: 'Read',
  talkTab: 'Talk',
  historyTab: 'View history',
};

export const UKRAINIAN: InterfaceLanguage = {
  code: 'uk',
  autonym: 'українська',
  preferencesHeading: 'Налаштування',
  userProfileTab: 'Особові дані',
  internationalisationSection: 'Інтернаціоналізація',
  saveButton: 'Зберегти',
  readTab: 'Читати',
  talkTab: 'Обговорення',
  historyTab: 'Переглянути історію',
};
