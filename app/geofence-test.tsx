import * as Location from "expo-location";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import { GEOFENCE_TASK_NAME } from "@/src/geofence/geofence.task";

export default function GeofenceTestScreen() {
  const [lat, setLat] = useState("23.8103");
  const [lng, setLng] = useState("90.4125");
  const [radius, setRadius] = useState("100");
  const [status, setStatus] = useState<string>("Idle");

  const region = useMemo(() => {
    const latitude = Number(lat);
    const longitude = Number(lng);
    const r = Number(radius);

    return {
      identifier: "test-region",
      latitude,
      longitude,
      radius: Number.isFinite(r) ? r : 100,
      notifyOnEnter: true,
      notifyOnExit: true,
    };
  }, [lat, lng, radius]);

  async function requestPermissions() {
    const fg = await Location.requestForegroundPermissionsAsync();
    if (fg.status !== "granted") {
      setStatus("Foreground permission not granted");
      return false;
    }

    const bg = await Location.requestBackgroundPermissionsAsync();
    if (bg.status !== "granted") {
      setStatus("Background permission not granted");
      return false;
    }

    return true;
  }

  async function start() {
    setStatus("Starting...");

    const ok = await requestPermissions();
    if (!ok) return;

    await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, [region]);
    setStatus(
      `Geofencing started: ${region.latitude}, ${region.longitude}, r=${region.radius}m`,
    );
  }

  async function stop() {
    setStatus("Stopping...");
    try {
      await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
    } finally {
      setStatus("Stopped");
    }
  }

  async function check() {
    const started =
      await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);
    setStatus(started ? "Running" : "Not running");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: 12, padding: 24 }}>
      <Text variant="headlineSmall">Geofence Test</Text>

      <TextInput
        label="Latitude"
        value={lat}
        onChangeText={setLat}
        keyboardType="numeric"
      />
      <TextInput
        label="Longitude"
        value={lng}
        onChangeText={setLng}
        keyboardType="numeric"
      />
      <TextInput
        label="Radius (meters)"
        value={radius}
        onChangeText={setRadius}
        keyboardType="numeric"
      />

      <Button mode="contained" onPress={start}>
        Start geofencing
      </Button>

      <Button mode="outlined" onPress={stop}>
        Stop geofencing
      </Button>

      <Button mode="text" onPress={check}>
        Check status
      </Button>

      <Text>State: {status}</Text>

      <Text style={{ opacity: 0.7 }}>
        ENTER/EXIT logs will appear in the Metro / device logs.
      </Text>
    </View>
  );
}
