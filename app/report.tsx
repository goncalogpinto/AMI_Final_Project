import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { logInteraction } from "../utils/interactionLogger";

const waitOptions = [
  { label: "0–5 min", value: "0-5", minutes: 4 },
  { label: "5–10 min", value: "5-10", minutes: 8 },
  { label: "10–15 min", value: "10-15", minutes: 12 },
  { label: "15+ min", value: "15+", minutes: 18 },
];

export default function ReportScreen() {
  const { id } = useLocalSearchParams();
  const { locations } = useAppContext();

  const sortedLocations = [...locations].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-PT")
  );

  const initialLocationId =
    typeof id === "string" && locations.some((location) => location.id === id)
      ? id
      : sortedLocations[0]?.id ?? "";

  const [selectedLocationId, setSelectedLocationId] = useState(initialLocationId);
  const [selectedWaitValue, setSelectedWaitValue] = useState("10-15");

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId
  );

  const selectedWaitOption = waitOptions.find(
    (option) => option.value === selectedWaitValue
  ) ?? waitOptions[2];

  async function handleContinue() {
    logInteraction("continue_report", "report", {
      locationId: selectedLocationId,
      waitLabel: selectedWaitOption.label,
      waitMinutes: selectedWaitOption.minutes,
    });

    await Haptics.selectionAsync();

    router.push({
      pathname: "/qr-confirm",
      params: {
        id: selectedLocationId,
        waitLabel: selectedWaitOption.label,
        waitMinutes: String(selectedWaitOption.minutes),
      },
    });
  }

  return (
    <View style={styles.page}>
      <View style={styles.phone}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>← Voltar</Text>
          </Pressable>

          <Text style={styles.title}>Reportar fila</Text>
          <Text style={styles.subtitle}>
            Escolhe o local e o tempo de espera estimado. Depois confirma que estás no local através de QR code.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Local</Text>

            {sortedLocations.map((location) => (
              <Pressable
                key={location.id}
                style={[
                  styles.optionButton,
                  selectedLocationId === location.id && styles.optionButtonActive,
                ]}
                onPress={() => {
                  setSelectedLocationId(location.id);

                  logInteraction("select_report_location", "report", {
                    locationId: location.id,
                    locationName: location.name,
                  });
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedLocationId === location.id && styles.optionTextActive,
                  ]}
                >
                  {location.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tempo de espera</Text>

            {waitOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.optionButton,
                  selectedWaitValue === option.value && styles.optionButtonActive,
                ]}
                onPress={() => {
                  setSelectedWaitValue(option.value);

                  logInteraction("select_report_wait", "report", {
                    waitLabel: option.label,
                    waitMinutes: option.minutes,
                  });
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedWaitValue === option.value && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Resumo do reporte</Text>
            <Text style={styles.infoText}>Local: {selectedLocation?.name}</Text>
            <Text style={styles.infoText}>Espera estimada: {selectedWaitOption.label}</Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </Pressable>
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
  subtitle: { fontSize: 15, color: "#627D98", marginTop: 6, marginBottom: 24, lineHeight: 22 },
  section: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 18, marginBottom: 18 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: "#102A43", marginBottom: 14 },
  optionButton: { borderWidth: 2, borderColor: "#E6EDF3", borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 10 },
  optionButtonActive: { borderColor: "#0E7490", backgroundColor: "#E0F7FA" },
  optionText: { fontSize: 16, fontWeight: "700", color: "#486581" },
  optionTextActive: { color: "#0E7490" },
  infoBox: { backgroundColor: "#EFF6FF", borderRadius: 18, padding: 18, marginBottom: 18 },
  infoTitle: { fontSize: 16, fontWeight: "800", color: "#102A43", marginBottom: 8 },
  infoText: { fontSize: 14, color: "#486581", marginTop: 4 },
  primaryButton: { backgroundColor: "#0E7490", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
