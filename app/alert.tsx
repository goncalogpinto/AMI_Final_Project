import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { logInteraction } from "../utils/interactionLogger";

const alertOptions = [5, 10, 15];

export default function AlertScreen() {
  const { id } = useLocalSearchParams();
  const { getLocationById, createAlert } = useAppContext();
  const location = getLocationById(String(id));
  const [selectedLimit, setSelectedLimit] = useState(10);
  const [alertCreated, setAlertCreated] = useState(false);

  async function handleActivateAlert() {
    if (!location) return;
    setAlertCreated(true);
    createAlert(location.id, selectedLimit);
    logInteraction("activate_alert", "alert", { locationId: location.id, locationName: location.name, selectedLimit });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  if (!location) {
    return <View style={styles.page}><View style={styles.phone}><View style={styles.content}><Text style={styles.title}>Local não encontrado</Text><Pressable style={styles.secondaryButton} onPress={() => router.back()}><Text style={styles.secondaryButtonText}>Voltar</Text></Pressable></View></View></View>;
  }

  return (
    <View style={styles.page}>
      <View style={styles.phone}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()}><Text style={styles.back}>← Voltar</Text></Pressable>
          <Text style={styles.title}>Ativar alerta</Text>
          <Text style={styles.subtitle}>Escolhe quando queres ser avisado sobre a fila do {location.name}.</Text>
          <View style={styles.locationCard}><Text style={styles.locationName}>{location.name}</Text><Text style={styles.currentWait}>Espera atual: {location.waitTime} min</Text></View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avisar quando a fila estiver abaixo de:</Text>
            {alertOptions.map((option) => (
              <Pressable key={option} style={[styles.optionButton, selectedLimit === option && styles.optionButtonActive]} onPress={() => { setSelectedLimit(option); logInteraction("select_alert_limit", "alert", { locationId: location.id, selectedLimit: option }); }}>
                <Text style={[styles.optionText, selectedLimit === option && styles.optionTextActive]}>{option} minutos</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.feedbackBox}><Text style={styles.feedbackTitle}>Feedback do alerta</Text><Text style={styles.feedbackText}>Quando o alerta for ativado, a aplicação dá confirmação visual, textual e háptica através de vibração.</Text></View>
          {alertCreated && <View style={styles.successBox}><Text style={styles.successTitle}>Alerta guardado</Text><Text style={styles.successText}>O alerta para o {location.name} foi adicionado ao histórico de alertas.</Text></View>}
          <Pressable style={styles.primaryButton} onPress={handleActivateAlert}><Text style={styles.primaryButtonText}>{alertCreated ? "Atualizar alerta" : "Ativar alerta"}</Text></Pressable>
          {alertCreated && <Pressable style={styles.secondaryButton} onPress={() => router.push("/alerts")}><Text style={styles.secondaryButtonText}>Ver alertas</Text></Pressable>}
          <Pressable style={styles.secondaryButton} onPress={() => router.push("/home")}><Text style={styles.secondaryButtonText}>Voltar ao início</Text></Pressable>
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
  locationCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  locationName: { fontSize: 20, fontWeight: "800", color: "#102A43" },
  currentWait: { marginTop: 8, fontSize: 15, color: "#627D98", fontWeight: "600" },
  section: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 18, marginBottom: 18 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#102A43", marginBottom: 14 },
  optionButton: { borderWidth: 2, borderColor: "#E6EDF3", borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 10 },
  optionButtonActive: { borderColor: "#0E7490", backgroundColor: "#E0F7FA" },
  optionText: { fontSize: 16, fontWeight: "700", color: "#486581" },
  optionTextActive: { color: "#0E7490" },
  feedbackBox: { backgroundColor: "#EFF6FF", borderRadius: 18, padding: 18, marginBottom: 18 },
  feedbackTitle: { fontSize: 16, fontWeight: "800", color: "#102A43", marginBottom: 6 },
  feedbackText: { fontSize: 14, color: "#486581", lineHeight: 20 },
  successBox: { backgroundColor: "#DCFCE7", borderRadius: 18, padding: 18, marginBottom: 18 },
  successTitle: { fontSize: 17, fontWeight: "800", color: "#166534", marginBottom: 6 },
  successText: { fontSize: 14, color: "#166534", lineHeight: 20 },
  primaryButton: { marginTop: 4, backgroundColor: "#0E7490", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondaryButton: { marginTop: 12, borderWidth: 2, borderColor: "#0E7490", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  secondaryButtonText: { color: "#0E7490", fontSize: 16, fontWeight: "800" },
});
