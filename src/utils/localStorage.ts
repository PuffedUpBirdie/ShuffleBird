interface ISettings {
  showImagePath?: boolean;
  showImmersiveBackground?: boolean;
  contrastMultiplier?: number;
}

export const getSettings = (): ISettings => {
  const localData = localStorage.getItem("settings");
  return localData ? JSON.parse(localData) : {};
};

export const setSettings = (settings: ISettings) => {
  localStorage.setItem("settings", JSON.stringify(settings));
};
