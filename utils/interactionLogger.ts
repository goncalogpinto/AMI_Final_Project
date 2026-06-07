export type InteractionLog = {
  event: string;
  screen: string;
  timestamp: string;
  details?: Record<string, string | number | boolean>;
};

let logs: InteractionLog[] = [];

export function logInteraction(
  event: string,
  screen: string,
  details?: Record<string, string | number | boolean>
) {
  const log: InteractionLog = {
    event,
    screen,
    timestamp: new Date().toISOString(),
    details,
  };

  logs.push(log);
  console.log("[CampusFlow Log]", log);
}

export function getInteractionLogs() {
  return logs;
}

export function clearInteractionLogs() {
  logs = [];
}

export function getLogsSummary() {
  const totalEvents = logs.length;
  const eventsByType = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.event] = (acc[log.event] || 0) + 1;
    return acc;
  }, {});
  const screensByType = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.screen] = (acc[log.screen] || 0) + 1;
    return acc;
  }, {});
  return { totalEvents, eventsByType, screensByType, logs };
}
