import * as SecureStore from 'expo-secure-store';

const PAIR_TOKEN = "XYXYXYXY"
const HUB_TOKEN = "HUBHUBHUB"

export const savePairToken = async (token: string) => {
  await SecureStore.setItemAsync(PAIR_TOKEN, token);
}

export const saveHubToken = async (token: string) => {
  await SecureStore.setItemAsync(HUB_TOKEN, token);
}

export const getPairToken = async () => {
  return await SecureStore.getItemAsync(PAIR_TOKEN);
}

export const getHubToken = async () => {
  return await SecureStore.getItemAsync(HUB_TOKEN);
}

export const clearPairToken = async () => {
  await SecureStore.deleteItemAsync(PAIR_TOKEN);
}

export const clearHubToken = async () => {
  await SecureStore.deleteItemAsync(HUB_TOKEN);
}