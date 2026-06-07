import * as Location from "expo-location";
import { logInteraction } from "./interactionLogger";

export type CampusLocationInput = {
  granted: boolean;
  latitude?: number;
  longitude?: number;
  source: "gps" | "denied" | "unavailable";
};

export async function requestCampusLocation(): Promise<CampusLocationInput> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();

    logInteraction("request_location_permission", "location", {
      granted: permission.granted,
    });

    if (!permission.granted) {
      return {
        granted: false,
        source: "denied",
      };
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    logInteraction("location_received", "location", {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      accuracy: currentLocation.coords.accuracy ?? 0,
    });

    return {
      granted: true,
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      source: "gps",
    };
  } catch (error) {
    logInteraction("location_error", "location", {
      message: String(error),
    });

    return {
      granted: false,
      source: "unavailable",
    };
  }
}