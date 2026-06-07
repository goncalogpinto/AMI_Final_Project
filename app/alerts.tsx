import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { logInteraction } from "../utils/interactionLogger";

export default function AlertsScreen() {
  const { alerts, notifications, cancelAlert } = useAppContext();

  const activeAlerts = alerts
    .filter((alert) => alert.status === "active")
    .sort((a, b) => a.locationName.localeCompare(b.locationName, "pt-PT"));

  const pastAlerts = alerts
    .filter((alert) => alert.status === "triggered")
    .sort((a, b) => a.locationName.localeCompare(b.locationName, "pt-PT"));

  function handleCancelAlert(alertId: string, locationName: string) {
    Alert.alert(
      "Cancelar alerta?",
      `Queres mesmo apagar o alerta do ${locationName}?`,
      [
        { text: "Manter", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => {
            cancelAlert(alertId);
            logInteraction("cancel_alert", "alerts", { alertId, locationName });
          },
        },
      ]
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.phone}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.push("/home")}>
            <Text style={styles.back}>← Voltar ao início</Text>
          </Pressable>

          <Text style={styles.title}>Alertas</Text>
          <Text style={styles.subtitle}>
            Consulta os alertas ativos, alertas recebidos e notificações.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              logInteraction("start_alert", "alerts", { source: "alerts_button" });
              router.push("/choose-alert");
            }}
          >
            <Text style={styles.primaryButtonText}>+ Ativar novo alerta</Text>
          </Pressable>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alertas ativos</Text>

            {activeAlerts.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>Sem alertas ativos</Text>
                <Text style={styles.emptyText}>
                  Ativa um alerta para seres avisado quando uma fila baixar do limite escolhido.
                </Text>
              </View>
            )}

            {activeAlerts.map((alert, index) => (
              <View key={`${alert.id}-active-${index}`} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{alert.locationName}</Text>
                  <Text style={styles.cardText}>
                    Avisar abaixo de {alert.threshold} min
                  </Text>
                  <Text style={styles.cardSmall}>Criado: {alert.createdAt}</Text>
                </View>

                <View style={styles.cardActions}>
                  <Text style={[styles.badge, styles.badgeActive]}>Ativo</Text>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => handleCancelAlert(alert.id, alert.locationName)}
                  >
                    <Text style={styles.cancelButtonText}>Apagar</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alertas passados</Text>

            {pastAlerts.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>Sem alertas recebidos</Text>
                <Text style={styles.emptyText}>
                  Quando um alerta for atingido, deixa de estar ativo e aparece aqui.
                </Text>
              </View>
            )}

            {pastAlerts.map((alert, index) => (
              <View key={`${alert.id}-past-${index}`} style={styles.cardPast}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{alert.locationName}</Text>
                  <Text style={styles.cardText}>
                    Limite atingido: abaixo de {alert.threshold} min
                  </Text>
                  <Text style={styles.cardSmall}>
                    Recebido: {alert.triggeredAt ?? "agora"}
                  </Text>
                </View>

                <Text style={[styles.badge, styles.badgeTriggered]}>Recebido</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notificações</Text>

            {notifications.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>Sem notificações</Text>
                <Text style={styles.emptyText}>
                  As notificações aparecem aqui quando uma fila fica abaixo do limite definido.
                </Text>
              </View>
            )}

            {notifications.map((notification, index) => (
              <View
                key={`${notification.id}-notification-${index}`}
                style={styles.notificationCard}
              >
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationText}>{notification.message}</Text>
                <Text style={styles.cardSmall}>{notification.createdAt}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <Pressable style={styles.navButton} onPress={() => router.push("/home")}>
            <Text style={styles.navItem}>Início</Text>
          </Pressable>

          <Pressable style={styles.navButton} onPress={() => router.push("/report")}>
            <Text style={styles.navItem}>Reportar</Text>
          </Pressable>

          <Pressable style={styles.navButton} onPress={() => router.push("/alerts")}>
            <Text style={styles.navItemActive}>Alertas</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#E5EDF2",
    alignItems: "center",
  },
  phone: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#F6F8FA",
  },
  content: {
    padding: 24,
    paddingTop: 56,
    paddingBottom: 140,
  },
  back: {
    color: "#0E7490",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#102A43",
  },
  subtitle: {
    fontSize: 15,
    color: "#627D98",
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: "#0E7490",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#102A43",
    marginBottom: 14,
  },
  emptyBox: {
    backgroundColor: "#F6F8FA",
    borderRadius: 16,
    padding: 18,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#102A43",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#627D98",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#F6F8FA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cardPast: {
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#102A43",
  },
  cardText: {
    fontSize: 14,
    color: "#486581",
    marginTop: 4,
  },
  cardSmall: {
    fontSize: 12,
    color: "#829AB1",
    marginTop: 6,
  },
  cardActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
  },
  badgeActive: {
    backgroundColor: "#E0F7FA",
    color: "#0E7490",
  },
  badgeTriggered: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },
  cancelButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  cancelButtonText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "800",
  },
  notificationCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#102A43",
  },
  notificationText: {
    fontSize: 14,
    color: "#486581",
    lineHeight: 20,
    marginTop: 6,
  },
  bottomNav: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 999,
  },
  navButton: {
    minWidth: 90,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  navItem: {
    color: "#829AB1",
    fontWeight: "700",
  },
  navItemActive: {
    color: "#0E7490",
    fontWeight: "900",
  },
});