import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppContext } from "../context/AppContext";
import { logInteraction } from "../utils/interactionLogger";

export default function QRConfirmScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    locationId?: string;
    waitRange?: string;
    waitLabel?: string;
    waitMinutes?: string;
  }>();

  const { getLocationById, updateLocationFromReport } = useAppContext();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const locationId = params.locationId ?? params.id ?? "";
  const waitRange = params.waitRange ?? "";
  const waitLabel = params.waitLabel ?? getWaitLabel(waitRange);
  const waitMinutes = params.waitMinutes ?? "";

  const location = getLocationById(locationId);

  function getWaitLabel(value: string) {
    if (value === "0-5") return "0–5 min";
    if (value === "5-10") return "5–10 min";
    if (value === "10-15") return "10–15 min";
    if (value === "15+") return "15+ min";
    return value;
  }

  function submitReport(qrData: string) {
    if (!location) {
      Alert.alert("Erro", "Local não encontrado.");
      return;
    }

    setScanned(true);

    logInteraction("qr_code_scanned", "qr_confirm", {
      locationId,
      qrData,
    });

    // Usa waitMinutes quando vem do report.tsx.
    // Se não existir, usa waitRange.
    updateLocationFromReport(location.id, waitMinutes || waitRange);

    logInteraction("report_sent", "qr_confirm", {
      locationId: location.id,
      locationName: location.name,
      waitRange,
      waitLabel,
      waitMinutes,
    });

    setReportSent(true);
  }

  if (!location) {
    return (
      <View style={styles.screen}>
        <View style={styles.phone}>
          <Text style={styles.title}>Local não encontrado</Text>

          <Text style={styles.description}>
            Não foi possível identificar o local selecionado para este reporte.
          </Text>

          <Pressable style={styles.button} onPress={() => router.replace("/home")}>
            <Text style={styles.buttonText}>Voltar ao início</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (reportSent) {
    return (
      <View style={styles.screen}>
        <View style={styles.phone}>
          <View style={styles.successCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>

          <Text style={styles.title}>Reporte enviado</Text>
          <Text style={styles.description}>
            Obrigado pela contribuição. O tempo de espera do {location.name} foi atualizado.
          </Text>

          <Pressable style={styles.button} onPress={() => router.replace("/home")}>
            <Text style={styles.buttonText}>Voltar ao início</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.screen}>
        <View style={styles.phone}>
          <ActivityIndicator />
          <Text style={styles.description}>A verificar permissões da câmara...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.screen}>
        <View style={styles.phone}>
          <Text style={styles.backText} onPress={() => router.back()}>
            ‹ Voltar
          </Text>

          <Text style={styles.title}>Permissão da câmara</Text>
          <Text style={styles.description}>
            Para confirmar o local, a aplicação precisa de acesso à câmara para ler um QR code.
          </Text>

          <Pressable
            style={styles.button}
            onPress={async () => {
              const result = await requestPermission();

              logInteraction("request_camera_permission", "qr_confirm", {
                granted: result.granted,
              });
            }}
          >
            <Text style={styles.buttonText}>Permitir câmara</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.phone}>
        <Text style={styles.backText} onPress={() => router.back()}>
          ‹ Voltar
        </Text>

        <Text style={styles.title}>Ler QR code</Text>
        <Text style={styles.description}>
          Aponta a câmara para qualquer QR code para confirmar o reporte.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Reporte preparado</Text>
          <Text style={styles.summaryText}>Local: {location.name}</Text>
          <Text style={styles.summaryText}>Tempo estimado: {waitLabel}</Text>
        </View>

        <View style={styles.cameraBox}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={
              scanned
                ? undefined
                : (event) => {
                    submitReport(event.data);
                  }
            }
          />

          <View style={styles.scanOverlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>A procurar QR code...</Text>
          </View>
        </View>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            setScanned(false);
          }}
        >
          <Text style={styles.secondaryButtonText}>Ler novamente</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EAF1F4",
    alignItems: "center",
  },
  phone: {
    width: "100%",
    maxWidth: 430,
    flex: 1,
    backgroundColor: "#F5F8FA",
    paddingHorizontal: 24,
    paddingTop: 54,
  },
  backText: {
    color: "#0E7490",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#172B3A",
    marginBottom: 8,
  },
  description: {
    color: "#60758A",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#EAF4F7",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  summaryLabel: {
    color: "#172B3A",
    fontWeight: "900",
    marginBottom: 8,
  },
  summaryText: {
    color: "#60758A",
    fontWeight: "700",
    marginTop: 4,
  },
  cameraBox: {
    height: 320,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#D8E8EE",
    marginBottom: 16,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  scanFrame: {
    width: 190,
    height: 190,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  scanText: {
    marginTop: 16,
    color: "#FFFFFF",
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowRadius: 5,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 120,
    marginBottom: 22,
  },
  successIcon: {
    color: "#16A34A",
    fontSize: 54,
    fontWeight: "900",
  },
  button: {
    backgroundColor: "#0E7490",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDE7ED",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#0E7490",
    fontWeight: "900",
  },
});