import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { Button, Text } from "react-native-paper";

export default function NFCScan() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scanLockRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const supported = await NfcManager.isSupported();
        if (!mounted) return;
        setIsSupported(supported);

        if (!supported) {
          setInitError("NFC is not supported on this device.");
          return;
        }

        try {
          await NfcManager.start();
        } catch (e: any) {
          if (!mounted) return;
          setInitError(e?.message ?? "Failed to initialize NFC.");
          return;
        }

        const enabled = await NfcManager.isEnabled();
        if (!mounted) return;
        setIsEnabled(enabled);

        if (!enabled) {
          setInitError("NFC is turned off. Enable NFC to continue.");
        }
      } catch (e: any) {
        if (!mounted) return;
        setInitError(e?.message ?? "Failed to initialize NFC.");
      }
    };

    void init();

    return () => {
      mounted = false;
      // Cleanup when leaving screen
      void NfcManager.cancelTechnologyRequest().catch(() => undefined);
    };
  }, []);

  async function scanNfc() {
    if (!isSupported) return;
    if (isEnabled === false) return;
    if (scanLockRef.current) return;
    scanLockRef.current = true;

    setIsScanning(true);

    try {
      await NfcManager.requestTechnology(NfcTech.NfcA); // listening for NFC 
      const tag = await NfcManager.getTag(); // received tag
      console.log("NFC Tag:", tag);

    } catch (e) {
      console.warn("NFC error", e);
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch {
      }
      setIsScanning(false);
      scanLockRef.current = false;
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Connect your Cosybee Hub</Text>

      <Text style={styles.subtitle}>
        {initError ?? "Hold your phone near the Cosybee Hub"}
      </Text>

      <Button
        mode="contained"
        onPress={scanNfc}
        disabled={
          isSupported === false ||
          isEnabled === false ||
          isSupported === null ||
          isScanning
        }
      >
        {isScanning ? "Scanning..." : "Start scanning"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  subtitle: {
    marginVertical: 16,
    opacity: 0.7,
  },
});
