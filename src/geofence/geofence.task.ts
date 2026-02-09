import { GeofencingEventType } from "expo-location";
import type { TaskManagerError, TaskManagerTaskBody } from "expo-task-manager";
import * as TaskManager from "expo-task-manager";

export const GEOFENCE_TASK_NAME = "cosybee-geofence-task";

type GeofenceTaskData = {
  eventType: GeofencingEventType;
  region: {
    identifier: string;
    latitude: number;
    longitude: number;
    radius: number;
  };
};

TaskManager.defineTask(
  GEOFENCE_TASK_NAME,
  async ({
    data,
    error,
  }: TaskManagerTaskBody<GeofenceTaskData>) => {
    const taskError: TaskManagerError | null = error ?? null;
    if (taskError) {
      console.log("[geofence] task error:", error);
      return;
    }

    const payload = data;
    if (!payload) {
      console.log("[geofence] task fired with no data");
      return;
    }

    const { eventType, region } = payload;

    if (eventType === GeofencingEventType.Enter) {
      console.log("[geofence] ENTER:", region.identifier, region);
    } else if (eventType === GeofencingEventType.Exit) {
      console.log("[geofence] EXIT:", region.identifier, region);
    } else {
      console.log("[geofence] event:", eventType, region);
    }
  },
);
