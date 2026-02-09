import { View } from "react-native";
import { RadioButton, Text } from "react-native-paper";

import { useTheme } from "@/src/theme/ThemeProvider";

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();

  return (
    <View style={{ padding: 24 }}>
      <Text variant="titleMedium">Theme</Text>

      <RadioButton.Group
        value={theme}
        onValueChange={(value) => setTheme(value as any)}
      >
        <RadioButton.Item label="System" value="system" />
        <RadioButton.Item label="Light" value="light" />
        <RadioButton.Item label="Dark" value="dark" />
      </RadioButton.Group>
    </View>
  );
}
