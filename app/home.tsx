import React, { useMemo, useRef, useState } from "react";
import {
    Dimensions,
    PanResponder,
    type PanResponderInstance,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const { width } = Dimensions.get("window");

function ThermostatDial({
  current = 21.5,
  min = 21.0,
  max = 22.0,
  onChangeCurrent,
}: {
  current?: number;
  min?: number;
  max?: number;
  onChangeCurrent?: (value: number) => void;
}) {
  const size = width * 0.65;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const startAngle = 135;
  const endAngle = 405;
  const totalSweep = endAngle - startAngle;

  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const arcPath = (from: number, to: number) => {
    const start = polarToCartesian(from);
    const end = polarToCartesian(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
  };

  const progress = Math.min(1, Math.max(0, (current - min) / (max - min)));
  const progressAngle = startAngle + totalSweep * progress;

  const knob = polarToCartesian(progressAngle);

  const onChangeRef = useRef(onChangeCurrent);
  onChangeRef.current = onChangeCurrent;

  const panResponder: PanResponderInstance | null = useMemo(() => {
    if (!onChangeRef.current) return null;

    const updateFromPoint = (x: number, y: number) => {
      const dx = x - cx;
      const dy = y - cy;
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (angle < 0) angle += 360;
      if (angle < 45) angle += 360;

      const clamped = Math.min(endAngle, Math.max(startAngle, angle));
      const nextProgress = (clamped - startAngle) / totalSweep;
      const next = min + nextProgress * (max - min);
      const rounded = Math.round(next * 2) / 2;
      onChangeRef.current?.(rounded);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateFromPoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderMove: (evt) => {
        updateFromPoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
    });
  }, [cx, cy, endAngle, max, min, startAngle, totalSweep]);

  return (
    <View
      style={{ alignItems: "center", padding: 20 }}
      {...(panResponder ? panResponder.panHandlers : undefined)}
    >
      <Svg width={size} height={size}>
        <Path
          d={arcPath(startAngle, endAngle)}
          stroke="#333"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={arcPath(startAngle, startAngle + totalSweep * 0.3)}
          stroke="#3b82f6"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={arcPath(startAngle + totalSweep * 0.6, endAngle)}
          stroke="#ef4444"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={arcPath(
            startAngle + totalSweep * 0.5,
            startAngle + totalSweep * 0.7,
          )}
          stroke="#f97316"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx={knob.x} cy={knob.y} r={10} fill="#fff" />
      </Svg>
      <View style={styles.dialTextContainer}>
        <Text style={styles.dialMin}>{min}°C</Text>
        <Text style={styles.dialCurrent}>{current}°C</Text>
        <Text style={styles.dialMax}>{max}°C</Text>
      </View>
    </View>
  );
}

function Chip({
  label,
  subtitle,
  active,
  color,
}: {
  label: string;
  subtitle: string;
  active?: boolean;
  color?: string;
}) {
  return (
    <View
      style={[styles.chip, active && { backgroundColor: color || "#1e3a5f" }]}
    >
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipSub}>{subtitle}</Text>
    </View>
  );
}

function RoomCard({
  room,
  temp,
  status,
  color,
}: {
  room: string;
  temp: string;
  status: string;
  color: string;
}) {
  return (
    <View style={[styles.roomCard, { backgroundColor: color }]}>
      <View style={styles.roomHeader}>
        <Text style={styles.roomName}>{room}</Text>
        <Text style={styles.roomArrow}>›</Text>
      </View>
      <Text style={styles.roomTemp}>{temp}</Text>
      <Text style={styles.roomStatus}>{status}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [livingRoomTemp, setLivingRoomTemp] = useState(21.5);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My home</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
      >
        <Chip label="Auto Mode" subtitle="Geofencing" active color="#1a3a2a" />
        <Chip label="Turn off" subtitle="All rooms" active color="#333" />
        <Chip label="Boost" subtitle="All rooms" active color="#3a2a1a" />
      </ScrollView>

      <View style={styles.thermostatCard}>
        <Text style={styles.roomTitle}>Living room</Text>
        <ThermostatDial
          current={livingRoomTemp}
          min={21.0}
          max={22.0}
          onChangeCurrent={setLivingRoomTemp}
        />
        <Text style={styles.insideText}>🏠 Inside now 22.5°C</Text>
      </View>

      <View style={styles.grid}>
        <RoomCard
          room="Bedroom"
          temp="20.5°C"
          status="Heating to 22.5°"
          color="#1a2a1a"
        />
        <RoomCard
          room="Kitchen"
          temp="24°C"
          status="Heating to 24.5°"
          color="#2a1a1a"
        />
        <RoomCard
          room="Upstair"
          temp="17.5°C"
          status="ECO Mode"
          color="#2a2a1a"
        />
        <RoomCard room="Downstair" temp="24°C" status="Off" color="#1a1a1a" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },

  chipRow: { marginBottom: 16 },
  chip: {
    backgroundColor: "#1c1c1e",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: "center",
  },
  chipLabel: { color: "#fff", fontWeight: "600", fontSize: 14 },
  chipSub: { color: "#aaa", fontSize: 11 },

  thermostatCard: {
    backgroundColor: "#1c1c1e",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  roomTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  dialTextContainer: {
    position: "absolute",
    top: "50%",
    alignItems: "center",
    marginTop: 20,
  },
  dialMin: { color: "#888", fontSize: 14 },
  dialCurrent: { color: "#fff", fontSize: 42, fontWeight: "bold" },
  dialMax: { color: "#888", fontSize: 14 },
  insideText: { color: "#ccc", fontSize: 14, marginTop: 8 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  roomCard: { width: "48%", borderRadius: 16, padding: 16, marginBottom: 12 },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomName: { color: "#fff", fontSize: 14, fontWeight: "600" },
  roomArrow: { color: "#fff", fontSize: 20 },
  roomTemp: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  roomStatus: { color: "#aaa", fontSize: 12 },
});
