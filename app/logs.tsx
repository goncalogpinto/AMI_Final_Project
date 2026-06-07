import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { clearInteractionLogs, getInteractionLogs, logInteraction } from "../utils/interactionLogger";

type CountItem = {
  label: string;
  value: number;
};

function getEventLabel(event: string) {
  const labels: Record<string, string> = {
    start_report: "Início de reporte",
    select_report_location: "Local selecionado",
    select_report_wait: "Tempo selecionado",
    continue_report: "Continuou para QR",
    report_sent: "Reporte enviado",
    open_alert_screen: "Ecrã de alerta aberto",
    activate_alert: "Alerta criado",
    open_location_detail: "Detalhe de local aberto",
    change_filter: "Filtro alterado",
    open_logs: "Estatísticas abertas",
  };

  return labels[event] ?? event;
}

export default function LogsScreen() {
  const [refreshKey, setRefreshKey] = useState(0);

  const logs = useMemo(() => getInteractionLogs(), [refreshKey]);

  const stats = useMemo(() => {
    const totalInteractions = logs.length;
    const reportsSent = logs.filter((log) => log.event === "report_sent").length;
    const alertsCreated = logs.filter((log) => log.event === "activate_alert").length;
    const locationsOpened = logs.filter((log) => log.event === "open_location_detail").length;
    const reportsStarted = logs.filter((log) => log.event === "start_report").length;

    const locationCounts: Record<string, number> = {};

    logs.forEach((log) => {
      const locationName = log.details?.locationName;
      if (typeof locationName === "string") {
        locationCounts[locationName] = (locationCounts[locationName] ?? 0) + 1;
      }
    });

    const mostUsedLocations: CountItem[] = Object.entries(locationCounts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    return {
      totalInteractions,
      reportsStarted,
      reportsSent,
      alertsCreated,
      locationsOpened,
      mostUsedLocations,
    };
  }, [logs]);

  const recentLogs = [...logs].reverse().slice(0, 12);

  function resetLogs() {
    clearInteractionLogs();
    setRefreshKey((current) => current + 1);
  }

  return (
    <View style={styles.page}>
      <View style={styles.phone}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable style={styles.backButton} onPress={() => router.push("/home")}>
              <Text style={styles.backButtonText}>‹ Voltar</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Estatísticas</Text>
          <Text style={styles.subtitle}>Registo quantitativo das interações dos testes de usabilidade.</Text>

          <View style={styles.grid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalInteractions}</Text>
              <Text style={styles.statLabel}>Interações</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.reportsSent}</Text>
              <Text style={styles.statLabel}>Reportes enviados</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.alertsCreated}</Text>
              <Text style={styles.statLabel}>Alertas criados</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.locationsOpened}</Text>
              <Text style={styles.statLabel}>Locais consultados</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Locais mais usados</Text>
            {stats.mostUsedLocations.length === 0 ? (
              <Text style={styles.emptyText}>Ainda não há dados de locais.</Text>
            ) : (
              stats.mostUsedLocations.map((item) => (
                <View key={item.label} style={styles.rowItem}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowValue}>{item.value}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Últimos eventos</Text>
            {recentLogs.length === 0 ? (
              <Text style={styles.emptyText}>Ainda não existem interações registadas.</Text>
            ) : (
              recentLogs.map((log, index) => (
                <View key={`${log.timestamp}-${index}`} style={styles.logItem}>
                  <Text style={styles.logTitle}>{getEventLabel(log.event)}</Text>
                  <Text style={styles.logMeta}>{log.screen} · {new Date(log.timestamp).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}</Text>
                </View>
              ))
            )}
          </View>

          <Pressable style={styles.secondaryButton} onPress={() => setRefreshKey((current) => current + 1)}>
            <Text style={styles.secondaryButtonText}>Atualizar estatísticas</Text>
          </Pressable>

          <Pressable style={styles.dangerButton} onPress={resetLogs}>
            <Text style={styles.dangerButtonText}>Limpar logs para novo teste</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.bottomNav}>
          <Pressable style={styles.navButton} onPress={() => router.push("/home")}>
            <Text style={styles.navItem}>Início</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => router.push("/report")}>
            <Text style={styles.navItem}>Reportar</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => router.push("/alerts")}>
            <Text style={styles.navItem}>Alertas</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#E5EDF2", alignItems: "center" },
  phone: { flex: 1, width: "100%", maxWidth: 430, backgroundColor: "#F6F8FA" },
  content: { padding: 24, paddingTop: 44, paddingBottom: 140 },
  headerRow: { marginBottom: 12 },
  backButton: { alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 2 },
  backButtonText: { color: "#0E7490", fontWeight: "800", fontSize: 15 },
  title: { fontSize: 28, fontWeight: "700", color: "#102A43" },
  subtitle: { fontSize: 15, color: "#627D98", marginTop: 4, marginBottom: 20, lineHeight: 21 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: { width: "48%", backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  statValue: { fontSize: 30, fontWeight: "900", color: "#0E7490" },
  statLabel: { fontSize: 13, color: "#627D98", marginTop: 6, fontWeight: "700" },
  section: { marginTop: 22, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#102A43", marginBottom: 14 },
  emptyText: { color: "#829AB1", fontWeight: "600", lineHeight: 20 },
  rowItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E6EDF3" },
  rowLabel: { color: "#102A43", fontWeight: "700" },
  rowValue: { color: "#0E7490", fontWeight: "900" },
  logItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E6EDF3" },
  logTitle: { color: "#102A43", fontWeight: "800" },
  logMeta: { color: "#829AB1", marginTop: 4, fontSize: 12, fontWeight: "600" },
  secondaryButton: { marginTop: 22, borderRadius: 16, paddingVertical: 15, alignItems: "center", backgroundColor: "#0E7490" },
  secondaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  dangerButton: { marginTop: 12, borderRadius: 16, paddingVertical: 15, alignItems: "center", backgroundColor: "#FEE2E2" },
  dangerButtonText: { color: "#B91C1C", fontSize: 15, fontWeight: "800" },
  bottomNav: { position: "absolute", left: 20, right: 20, bottom: 20, backgroundColor: "#FFFFFF", borderRadius: 24, paddingVertical: 10, flexDirection: "row", justifyContent: "space-around", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 20, zIndex: 999 },
  navButton: { minWidth: 90, minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: 18 },
  navItem: { color: "#829AB1", fontWeight: "700" },
});
