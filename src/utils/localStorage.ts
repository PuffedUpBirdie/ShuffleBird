interface ISettings {
  showImagePath?: boolean;
  sessionLimitEnabled?: boolean;
  sessionImageCount?: number;
}

export const getSettings = (): ISettings => {
  const localData = localStorage.getItem("settings");
  return localData ? JSON.parse(localData) : {};
};

export const setSettings = (settings: ISettings) => {
  localStorage.setItem("settings", JSON.stringify(settings));
};
