import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../../context/AppContext";
import { logInteraction } from "../../utils/interactionLogger";

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getLocationById } = useAppContext();
  const location = getLocationById(String(id));

  if (!location) {
    return <View style={styles.page}><View style={styles.phone}><View style={styles.content}><Text style={styles.title}>Local não encontrado</Text><Pressable style={styles.secondaryButton} onPress={() => router.back()}><Text style={styles.secondaryButtonText}>Voltar</Text></Pressable></View></View></View>;
  }

  return (
    <View style={styles.page}>
      <View style={styles.phone}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>← Voltar</Text></Pressable>
          <Text style={styles.title}>{location.name}</Text>
          <Text style={styles.subtitle}>{location.description}</Text>

          <View style={styles.mainCard}>
            <Text style={styles.waitTime}>{location.waitTime} min</Text>
            <Text style={[styles.status, location.status === "Curta" && styles.statusShort, location.status === "Moderada" && styles.statusMedium, location.status === "Longa" && styles.statusLong]}>Fila {location.status.toLowerCase()}</Text>
            <Text style={styles.lastReport}>Último reporte {location.lastReport}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico recente</Text>
            {location.history.map((item) => (
              <View key={`${item.time}-${item.wait}`} style={styles.historyRow}>
                <Text style={styles.historyTime}>{item.time}</Text>
                <View style={styles.historyBarBackground}><View style={[styles.historyBar, { width: `${Math.min(item.wait * 4, 100)}%` }]} /></View>
                <Text style={styles.historyWait}>{item.wait} min</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.primaryButton} onPress={() => { logInteraction("open_alert_screen", "location_detail", { locationId: location.id, locationName: location.name }); router.push({ pathname: "/alert", params: { id: location.id } }); }}><Text style={styles.primaryButtonText}>Ativar alerta</Text></Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => { logInteraction("start_report", "location_detail", { locationId: location.id, locationName: location.name }); router.push({ pathname: "/report", params: { id: location.id } }); }}><Text style={styles.secondaryButtonText}>Reportar fila</Text></Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#E5EDF2", alignItems: "center" },
  phone: { flex: 1, width: "100%", maxWidth: 430, backgroundColor: "#F6F8FA" },
  content: { padding: 24, paddingTop: 56, paddingBottom: 80 },
  back: { color: "#0E7490", fontSize: 15, fontWeight: "700", marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "800", color: "#102A43" },
  subtitle: { fontSize: 15, color: "#627D98", marginTop: 6, marginBottom: 24 },
  mainCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 26, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  waitTime: { fontSize: 48, fontWeight: "800", color: "#102A43" },
  status: { marginTop: 8, fontSize: 16, fontWeight: "800" },
  statusShort: { color: "#16A34A" },
  statusMedium: { color: "#D97706" },
  statusLong: { color: "#DC2626" },
  lastReport: { marginTop: 18, color: "#829AB1", fontSize: 14 },
  section: { marginTop: 24, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#102A43", marginBottom: 16 },
  historyRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
  historyTime: { width: 48, color: "#627D98", fontWeight: "600" },
  historyBarBackground: { flex: 1, height: 10, backgroundColor: "#E6EDF3", borderRadius: 8, overflow: "hidden" },
  historyBar: { height: "100%", backgroundColor: "#0E7490", borderRadius: 8 },
  historyWait: { width: 48, textAlign: "right", color: "#102A43", fontWeight: "700" },
  primaryButton: { marginTop: 28, backgroundColor: "#0E7490", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondaryButton: { marginTop: 12, borderWidth: 2, borderColor: "#0E7490", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  secondaryButtonText: { color: "#0E7490", fontSize: 16, fontWeight: "800" },
});
