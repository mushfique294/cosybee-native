import Zeroconf from "react-native-zeroconf";

import type { CosybeeDevice } from "./discovery.types";

let zeroconf: any = null;

function getZeroconf(): any {
  if (zeroconf) return zeroconf;
  try {
    zeroconf = new (Zeroconf as any)();
    return zeroconf;
  } catch {
    return null;
  }
}

function toDevice(service: any): CosybeeDevice {
  const addresses: unknown = service.addresses;
  const list = Array.isArray(addresses) ? addresses : [];
  const ipv4 = list.find((a) => typeof a === "string" && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(a));
  const ip = (ipv4 ?? list[0]) as string | undefined;
  const txt = (service.txt ?? undefined) as Record<string, string> | undefined;

  return {
    name: service.name,
    host: service.host,
    port: service.port,
    ip,
    txt,
    id: txt?.id,
    lastSeen: Date.now(),
  };
}

export function startCosybeeDiscovery(
  onDeviceFound: (device: CosybeeDevice) => void,
) {
  const zc = getZeroconf();
  if (!zc || typeof zc.scan !== "function") {
    return {
      ok: false as const,
      error:
        "Zeroconf is not available in this build. Rebuild and reinstall the dev build after adding react-native-zeroconf.",
    };
  }

  zc.removeAllListeners?.();

  zc.on?.("resolved", (service: any) => {
    onDeviceFound(toDevice(service));
  });

  try {
    zc.scan?.("cosybee", "tcp", "local.");
  } catch {
    return {
      ok: false as const,
      error:
        "Failed to start Zeroconf scan. Ensure you rebuilt and reinstalled the dev build after adding react-native-zeroconf.",
    };
  }

  return { ok: true as const };
}

export function stopCosybeeDiscovery() {
  const zc = getZeroconf();
  if (!zc || typeof zc.stop !== "function") return;
  try {
    zc.stop();
  } catch {
    // ignore
  }
}
