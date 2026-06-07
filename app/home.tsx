import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { logInteraction } from "../utils/interactionLogger";

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = useState("Menor espera");
  const { locations } = useAppContext();

  const sortedLocations = [...locations].sort((a, b) => {
    if (selectedFilter === "Menor espera") return a.waitTime - b.waitTime;
    return 0;
  });

  return (
    <View style={styles.page}>
      <View style={styles.phone}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Campus ISEL</Text>
          <Text style={styles.subtitle}>Tempos de espera agora</Text>

          <View style={styles.filters}>
            {["Menor espera", "Mais perto", "Dados recentes"].map((filter) => (
              <Pressable
                key={filter}
                onPress={() => {
                  setSelectedFilter(filter);
                  logInteraction("change_filter", "home", { filter });
                }}
                style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
              >
                <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>{filter}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.cards}>
            {sortedLocations.map((location) => (
              <Pressable
                key={location.id}
                style={styles.card}
                onPress={() => {
                  logInteraction("open_location_detail", "home", { locationId: location.id, locationName: location.name });
                  router.push({ pathname: "/location/[id]", params: { id: location.id } });
                }}
              >
                <View>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.lastReport}>Último reporte {location.lastReport}</Text>
                </View>
                <View style={styles.waitInfo}>
                  <Text style={styles.waitTime}>{location.waitTime} min</Text>
                  <Text style={[styles.status, location.status === "Curta" && styles.statusShort, location.status === "Moderada" && styles.statusMedium, location.status === "Longa" && styles.statusLong]}>
                    {location.status}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionButton, styles.reportButton]}
              onPress={() => {
                logInteraction("start_report", "home", { source: "main_button" });
                router.push("/report");
              }}
            >
              <Text style={styles.reportButtonText}>Reportar fila</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.alertButton]}
              onPress={() => {
                logInteraction("start_alert", "home", { source: "main_button" });
                router.push("/choose-alert");
              }}
            >
              <Text style={styles.alertButtonText}>Ativar alerta</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.logsButton}
            onPress={() => {
              logInteraction("open_logs", "home", { source: "home_button" });
              router.push("/logs");
            }}
          >
            <Text style={styles.logsButtonText}>Ver estatísticas dos testes</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.bottomNav}>
          <Pressable style={styles.navButton} onPress={() => router.push("/home")}>
            <Text style={styles.navItemActive}>Início</Text>
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
  content: { padding: 24, paddingTop: 56, paddingBottom: 160 },
  title: { fontSize: 28, fontWeight: "700", color: "#102A43" },
  subtitle: { fontSize: 15, color: "#627D98", marginTop: 4, marginBottom: 20 },
  filters: { flexDirection: "row", gap: 8, marginBottom: 20 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "#E6EDF3" },
  filterButtonActive: { backgroundColor: "#0E7490" },
  filterText: { fontSize: 12, color: "#486581", fontWeight: "600" },
  filterTextActive: { color: "#FFFFFF" },
  cards: { gap: 14 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  locationName: { fontSize: 18, fontWeight: "700", color: "#102A43" },
  lastReport: { fontSize: 13, color: "#829AB1", marginTop: 6 },
  waitInfo: { alignItems: "flex-end" },
  waitTime: { fontSize: 24, fontWeight: "700", color: "#102A43" },
  status: { marginTop: 4, fontSize: 13, fontWeight: "700" },
  statusShort: { color: "#16A34A" },
  statusMedium: { color: "#D97706" },
  statusLong: { color: "#DC2626" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 26 },
  actionButton: { flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  reportButton: { backgroundColor: "#0E7490" },
  alertButton: { backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#0E7490" },
  reportButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  alertButtonText: { color: "#0E7490", fontSize: 15, fontWeight: "800" },
  logsButton: { marginTop: 12, backgroundColor: "#E6EDF3", borderRadius: 16, paddingVertical: 15, alignItems: "center" },
  logsButtonText: { color: "#0E7490", fontSize: 15, fontWeight: "800" },
  bottomNav: { position: "absolute", left: 20, right: 20, bottom: 20, backgroundColor: "#FFFFFF", borderRadius: 24, paddingVertical: 10, flexDirection: "row", justifyContent: "space-around", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 20, zIndex: 999 },
  navButton: { minWidth: 90, minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: 18 },
  navItem: { color: "#829AB1", fontWeight: "700" },
  navItemActive: { color: "#0E7490", fontWeight: "900" },
});
