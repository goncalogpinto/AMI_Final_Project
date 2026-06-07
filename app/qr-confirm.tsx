import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { logInteraction } from "../utils/interactionLogger";

export default function QRConfirmScreen() {
  const { id, waitLabel, waitMinutes } = useLocalSearchParams();
  const { getLocationById, updateLocationFromReport } = useAppContext();

  const locationId = String(id);
  const waitLabelText = String(waitLabel ?? "");
  const waitMinutesNumber = Number(waitMinutes ?? 10);

  const location = getLocationById(locationId);
  const [reportSent, setReportSent] = useState(false);

  async function confirmReport() {
    if (!location) return;

    updateLocationFromReport(location.id, waitMinutesNumber);
    setReportSent(true);

    logInteraction("report_sent", "qr_confirm", {
      locationId: location.id,
      locationName: location.name,
      waitLabel: waitLabelText,
      waitMinutes: waitMinutesNumber,
    });

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  if (!location) {
    return (
      <View style={styles.page}>
        <View style={styles.phone}>
          <View style={styles.content}>
            <Text style={styles.title}>Local não encontrado</Text>
            <Pressable style={styles.secondaryButton} onPress={() => router.push("/home")}>
              <Text style={styles.secondaryButtonText}>Voltar ao início</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.phone}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>← Voltar</Text>
          </Pressable>

          <Text style={styles.title}>Confirmar local</Text>
          <Text style={styles.subtitle}>Simulação da confirmação por QR code no {location.name}.</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Reporte preparado</Text>
            <Text style={styles.infoText}>Local: {location.name}</Text>
            <Text style={styles.infoText}>Tempo estimado: {waitLabelText}</Text>
          </View>

          {!reportSent && (
            <View style={styles.qrBox}>
              <Text style={styles.qrIcon}>▦</Text>
              <Text style={styles.qrTitle}>QR code do local</Text>
              <Text style={styles.qrText}>Esta etapa representa a validação do local através da câmara/QR code.</Text>
            </View>
          )}

          {reportSent && (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Reporte enviado</Text>
              <Text style={styles.successText}>
                O reporte para o {location.name} foi registado. O tempo de espera foi atualizado para {waitMinutesNumber} min.
              </Text>
            </View>
          )}

          {!reportSent ? (
            <Pressable style={styles.primaryButton} onPress={confirmReport}>
              <Text style={styles.primaryButtonText}>Simular leitura QR</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryButton} onPress={() => router.replace("/home")}>
              <Text style={styles.primaryButtonText}>Voltar ao início</Text>
            </Pressable>
          )}
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
  infoBox: { backgroundColor: "#EFF6FF", borderRadius: 18, padding: 18, marginBottom: 18 },
  infoTitle: { fontSize: 16, fontWeight: "800", color: "#102A43", marginBottom: 8 },
  infoText: { fontSize: 14, color: "#486581", marginTop: 4 },
  qrBox: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 28, alignItems: "center", marginBottom: 18 },
  qrIcon: { fontSize: 64, color: "#0E7490", marginBottom: 12 },
  qrTitle: { fontSize: 20, fontWeight: "900", color: "#102A43", marginBottom: 8 },
  qrText: { fontSize: 14, color: "#627D98", lineHeight: 20, textAlign: "center" },
  successBox: { backgroundColor: "#DCFCE7", borderRadius: 22, padding: 24, alignItems: "center", marginBottom: 18 },
  successIcon: { fontSize: 48, fontWeight: "900", color: "#16A34A", marginBottom: 8 },
  successTitle: { fontSize: 22, fontWeight: "900", color: "#166534", marginBottom: 8 },
  successText: { fontSize: 15, color: "#166534", textAlign: "center", lineHeight: 22 },
  primaryButton: { backgroundColor: "#0E7490", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondaryButton: { marginTop: 12, borderWidth: 2, borderColor: "#0E7490", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  secondaryButtonText: { color: "#0E7490", fontSize: 16, fontWeight: "800" },
});
