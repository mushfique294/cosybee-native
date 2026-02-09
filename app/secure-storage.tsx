import { View } from "react-native";
import { Button, Text } from "react-native-paper";

import {
    clearHubToken,
    clearPairToken,
    getHubToken,
    getPairToken,
    saveHubToken,
    savePairToken,
} from "@/src/storage/secure.storage";

export default function SecureStoreTest() {
  async function save() {
    await savePairToken("PAIR_ABC_123");
    await saveHubToken("HUB_SECRET_XYZ");
    alert("Secrets saved 🔐");
  }

  async function read() {
    const token = await getPairToken();
    const secret = await getHubToken();
    alert(`Token: ${token}\nSecret: ${secret}`);
  }

  async function clear() {
    await clearPairToken();
    await clearHubToken();
    alert("Secrets cleared 🧹");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: 12, padding: 24 }}>
      <Text variant="headlineSmall">SecureStore Test</Text>

      <Button mode="contained" onPress={save}>
        Save fake secrets
      </Button>

      <Button mode="outlined" onPress={read}>
        Read secrets
      </Button>

      <Button mode="text" onPress={clear}>
        Clear secrets
      </Button>
    </View>
  );
}
