export enum SettingsStackScreens {
  Settings = 'Settings',
  PinChange = 'PinChange',
}

export type SettingsStackParamList = {
  [SettingsStackScreens.Settings]: undefined;
  [SettingsStackScreens.PinChange]: undefined;
};
