import { useEffect, useState } from "react";

import { startCosybeeDiscovery, stopCosybeeDiscovery } from "./discovery.service";
import type { CosybeeDevice } from "./discovery.types";

export function useCosybeeDiscovery() {
  const [devices, setDevices] = useState<CosybeeDevice[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const result = startCosybeeDiscovery((device) => {
      setDevices((prev) => {
        const key =
          device.id ?? `${device.name}:${device.ip ?? device.host}:${device.port}`;

        const now = Date.now();
        const existingIndex = prev.findIndex(
          (d) =>
            (d.id ?? `${d.name}:${d.ip ?? d.host}:${d.port}`) === key,
        );

        if (existingIndex === -1) {
          return [...prev, { ...device, lastSeen: now }];
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...device,
          lastSeen: now,
        };
        return updated;
      });
    });

    if (result?.ok === false) {
      setError(result.error);
    }

    const pruneInterval = setInterval(() => {
      const now = Date.now();
      setDevices((prev) =>
        prev.filter((d) => (d.lastSeen ?? now) > now - 15_000),
      );
    }, 2_000);

    return () => {
      clearInterval(pruneInterval);
      stopCosybeeDiscovery();
      setDevices([]);
    };
  }, []);

  return { devices, error };
}
