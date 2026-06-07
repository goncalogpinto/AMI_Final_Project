import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { logInteraction } from "../utils/interactionLogger";

export default function ChooseAlertScreen() {
  const { locations } = useAppContext();

  const sortedLocations = [...locations].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-PT")
  );

  return (
    <View style={styles.page}>
      <View style={styles.phone}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>← Voltar</Text>
          </Pressable>

          <Text style={styles.title}>Ativar alerta</Text>
          <Text style={styles.subtitle}>
            Escolhe o local onde queres receber um aviso quando a fila baixar.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Locais</Text>

            {sortedLocations.map((location) => (
              <Pressable
                key={location.id}
                style={styles.card}
                onPress={() => {
                  logInteraction("choose_alert_location", "choose_alert", {
                    locationId: location.id,
                    locationName: location.name,
                  });

                  router.push({
                    pathname: "/alert",
                    params: { id: location.id },
                  });
                }}
              >
                <View>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationText}>Espera atual: {location.waitTime} min</Text>
                </View>
                <Text
                  style={[
                    styles.status,
                    location.status === "Curta" && styles.statusShort,
                    location.status === "Moderada" && styles.statusMedium,
                    location.status === "Longa" && styles.statusLong,
                  ]}
                >
                  {location.status}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <Pressable style={styles.navButton} onPress={() => router.push("/home") }>
            <Text style={styles.navItem}>Início</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => router.push("/report") }>
            <Text style={styles.navItem}>Reportar</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => router.push("/alerts") }>
            <Text style={styles.navItemActive}>Alertas</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#E5EDF2", alignItems: "center" },
  phone: { flex: 1, width: "100%", maxWidth: 430, backgroundColor: "#F6F8FA" },
  content: { padding: 24, paddingTop: 56, paddingBottom: 140 },
  back: { color: "#0E7490", fontSize: 15, fontWeight: "700", marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "800", color: "#102A43" },
  subtitle: { fontSize: 15, color: "#627D98", marginTop: 6, marginBottom: 24, lineHeight: 22 },
  section: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 18, marginBottom: 18 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#102A43", marginBottom: 14 },
  card: { backgroundColor: "#F6F8FA", borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  locationName: { fontSize: 17, fontWeight: "800", color: "#102A43" },
  locationText: { fontSize: 13, color: "#627D98", marginTop: 5, fontWeight: "600" },
  status: { fontSize: 13, fontWeight: "800" },
  statusShort: { color: "#16A34A" },
  statusMedium: { color: "#D97706" },
  statusLong: { color: "#DC2626" },
  bottomNav: { position: "absolute", left: 20, right: 20, bottom: 20, backgroundColor: "#FFFFFF", borderRadius: 24, paddingVertical: 10, flexDirection: "row", justifyContent: "space-around", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 20, zIndex: 999 },
  navButton: { minWidth: 90, minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: 18 },
  navItem: { color: "#829AB1", fontWeight: "700" },
  navItemActive: { color: "#0E7490", fontWeight: "900" },
});
