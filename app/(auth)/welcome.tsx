import * as Linking from "expo-linking";
import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const features = [
  {
    icon: require("../../assets/images/Frame3.png"),
    title: "Always the right temperature",
    description:
      "Cosybee learns your home and keeps it comfortable automatically.",
  },
  {
    icon: require("../../assets/images/Frame.png"),
    title: "Lower energy bills, made easy",
    description:
      "Heat only when and where it’s needed, without manual control.",
  },
  {
    icon: require("../../assets/images/Frame2.png"),
    title: "Everything connected",
    description:
      "Boiler, heat pump, solar, and room controls – one simple app.",
  },
];

export default function Welcome() {
  const callSupport = () => {
    Linking.openURL("tel:+8801777777777");
  };
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
        width={120}
        height={104}
      />

      {/* Title */}
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to Cosybee®
      </Text>

      {/* Features */}
      <View style={styles.features}>
        {features.map((item, index) => (
          <View key={index} style={styles.featureRow}>
            <Image source={item.icon} style={styles.icon} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA */}
      <Button
        mode="contained"
        style={styles.primaryButton}
        onPress={() => router.push("/settings")}
      >
        Settings
      </Button>

      <Button
        mode="contained"
        style={styles.primaryButton}
        onPress={() => router.push("/secure-storage")}
      >
        Secure Storage Test
      </Button>
      <Button
        mode="contained"
        style={styles.primaryButton}
        onPress={() => router.push("/nfc")}
      >
        Scan NFC
      </Button>

      <Button
        mode="contained"
        style={styles.primaryButton}
        onPress={() => router.push("/(notifications)/notification")}
      >
        Test Notifications
      </Button>

      <Button
        mode="contained"
        style={styles.primaryButton}
        onPress={() => router.push("/device-discovery")}
      >
        Discover Devices
      </Button>

      <Button
        mode="contained"
        style={styles.primaryButton}
        onPress={() => router.push("/geofence-test" as any)}
      >
        Geofence Test
      </Button>

      <Button mode="text" onPress={() => router.push("/home")}>
        Sign In
      </Button>
      <Button
        mode="outlined"
        style={styles.primaryButton}
        onPress={callSupport}
      >
        Call Support
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "600",
  },
  features: {
    gap: 24,
    marginBottom: 48,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  icon: {
    width: 40,
    height: 40,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    opacity: 0.7,
    lineHeight: 20,
  },
  primaryButton: {
    marginBottom: 8,
  },
});
