import * as Haptics from "expo-haptics";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Alert } from "react-native";
import { locations as initialLocations } from "../data/locations";

type LocationStatus = "Curta" | "Moderada" | "Longa";
type AlertStatus = "active" | "triggered";

export type CampusLocation = {
  id: string;
  name: string;
  waitTime: number;
  status: LocationStatus;
  lastReport: string;
  description: string;
  history: {
    time: string;
    wait: number;
  }[];
};

export type CampusAlert = {
  id: string;
  locationId: string;
  locationName: string;
  threshold: number;
  status: AlertStatus;
  createdAt: string;
  triggeredAt?: string;
};

export type CampusNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

type AppContextValue = {
  locations: CampusLocation[];
  alerts: CampusAlert[];
  notifications: CampusNotification[];
  updateLocationFromReport: (locationId: string, waitMinutes: number) => void;
  createAlert: (locationId: string, threshold: number) => void;
  cancelAlert: (alertId: string) => void;
  getLocationById: (id: string) => CampusLocation | undefined;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function getStatusFromWait(waitTime: number): LocationStatus {
  if (waitTime <= 6) return "Curta";
  if (waitTime <= 14) return "Moderada";
  return "Longa";
}

function getCurrentTimeLabel() {
  const now = new Date();

  return now.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function notifyUser(title: string, message: string) {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  Alert.alert(title, message);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<CampusLocation[]>(
    initialLocations as CampusLocation[]
  );

  const [alerts, setAlerts] = useState<CampusAlert[]>([]);
  const [notifications, setNotifications] = useState<CampusNotification[]>([]);

  function getLocationById(id: string) {
    return locations.find((location) => location.id === id);
  }

  function updateLocationFromReport(locationId: string, waitMinutes: number) {
    const newWaitTime = Number(waitMinutes);
    const newStatus = getStatusFromWait(newWaitTime);
    const currentTime = getCurrentTimeLabel();

    const locationBeforeUpdate = locations.find((item) => item.id === locationId);

    setLocations((currentLocations) =>
      currentLocations.map((location) => {
        if (location.id !== locationId) {
          return location;
        }

        return {
          ...location,
          waitTime: newWaitTime,
          status: newStatus,
          lastReport: "agora",
          history: [
            ...location.history.slice(-3),
            {
              time: currentTime,
              wait: newWaitTime,
            },
          ],
        };
      })
    );

    if (!locationBeforeUpdate) {
      return;
    }

    const triggeredAlerts = alerts.filter(
      (alert) =>
        alert.locationId === locationId &&
        alert.status === "active" &&
        newWaitTime <= alert.threshold
    );

    if (triggeredAlerts.length > 0) {
      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) => {
          if (
            alert.locationId === locationId &&
            alert.status === "active" &&
            newWaitTime <= alert.threshold
          ) {
            return {
              ...alert,
              status: "triggered",
              triggeredAt: currentTime,
            };
          }

          return alert;
        })
      );

      const notificationMessage = `A fila do ${locationBeforeUpdate.name} está agora com ${newWaitTime} minutos.`;

      setNotifications((currentNotifications) => [
        {
          id: `notification-${Date.now()}`,
          title: "Alerta recebido",
          message: notificationMessage,
          createdAt: currentTime,
        },
        ...currentNotifications,
      ]);

      notifyUser("Alerta recebido", notificationMessage);
    }
  }

  function createAlert(locationId: string, threshold: number) {
    const location = locations.find((item) => item.id === locationId);

    if (!location) {
      return;
    }

    const currentTime = getCurrentTimeLabel();
    const isAlreadyBelowLimit = location.waitTime <= threshold;

    const newAlert: CampusAlert = {
      id: `alert-${Date.now()}`,
      locationId,
      locationName: location.name,
      threshold,
      status: isAlreadyBelowLimit ? "triggered" : "active",
      createdAt: currentTime,
      triggeredAt: isAlreadyBelowLimit ? currentTime : undefined,
    };

    setAlerts((currentAlerts) => [newAlert, ...currentAlerts]);

    if (isAlreadyBelowLimit) {
      const notificationMessage = `A fila do ${location.name} já está abaixo de ${threshold} minutos.`;

      setNotifications((currentNotifications) => [
        {
          id: `notification-${Date.now()}`,
          title: "Alerta recebido",
          message: notificationMessage,
          createdAt: currentTime,
        },
        ...currentNotifications,
      ]);

      notifyUser("Alerta recebido", notificationMessage);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  function cancelAlert(alertId: string) {
    setAlerts((currentAlerts) =>
      currentAlerts.filter((alert) => alert.id !== alertId)
    );
  }

  const value = useMemo(
    () => ({
      locations,
      alerts,
      notifications,
      updateLocationFromReport,
      createAlert,
      cancelAlert,
      getLocationById,
    }),
    [locations, alerts, notifications]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
