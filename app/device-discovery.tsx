import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import { useCosybeeDiscovery } from "@/src/features/discovery/discovery.hooks";

export default function DeviceDiscoveryScreen() {
  const { devices, error } = useCosybeeDiscovery();

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Nearby Cosybee Devices
      </Text>

      <View style={styles.list}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {devices.map((device) => {
          const key = `${device.ip ?? device.host}:${device.port}`;
          return (
            <Pressable key={key} style={styles.card}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceMeta}>
                {device.ip ?? device.host}:{device.port}
              </Text>
            </Pressable>
          );
        })}

        {devices.length === 0 && !error ? (
          <Text style={styles.empty}>No devices found yet…</Text>
        ) : null}
      </View>

      <Button mode="outlined" onPress={() => router.back()}>
        Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    marginBottom: 12,
  },
  list: {
    marginBottom: 16,
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#222",
  },
  deviceName: {
    color: "white",
    fontWeight: "600",
    marginBottom: 4,
  },
  deviceMeta: {
    color: "#aaa",
  },
  empty: {
    opacity: 0.7,
  },
  error: {
    marginBottom: 12,
    color: "#d00",
  },
});
