import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "app_theme";

export type AppTheme = "light" | "dark" | "system";

export async function saveTheme(theme: AppTheme) {
  await AsyncStorage.setItem(THEME_KEY, theme);
}

export async function loadTheme(): Promise<AppTheme | null> {
  return (await AsyncStorage.getItem(THEME_KEY)) as AppTheme | null;
}

export async function clearTheme() {
  await AsyncStorage.removeItem(THEME_KEY);
}
