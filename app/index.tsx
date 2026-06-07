import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function IntroScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.86)).current;
  const contentTranslateY = useRef(new Animated.Value(18)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(24)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const screenScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 58,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [buttonOpacity, buttonTranslateY, contentTranslateY, logoOpacity, logoScale]);

  function handleStart() {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 320,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(screenScale, {
        toValue: 1.04,
        duration: 320,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace("/home");
    });
  }

  return (
    <View style={styles.page}>
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.phone,
          {
            opacity: screenOpacity,
            transform: [{ scale: screenScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { translateY: contentTranslateY }],
            },
          ]}
        >
          <Image
            source={require("../assets/images/campusflow-white-clean.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.subtitle}>Evita filas no campus</Text>

          <View style={styles.metaBox}>
            <Text style={styles.metaText}>Projeto AMI</Text>
            <Text style={styles.metaText}>Gonçalo Pinto</Text>
            <Text style={styles.metaText}>ISEL · 2026</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.footer,
            {
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            },
          ]}
        >
          <Pressable style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Começar</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
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
    backgroundColor: "#0E7490",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 42,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 240,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.92)",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 4,
  },
  metaBox: {
    marginTop: 30,
    alignItems: "center",
    gap: 7,
  },
  metaText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.94)",
    fontWeight: "700",
  },
  footer: {
    width: "100%",
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#0E7490",
    fontSize: 16,
    fontWeight: "900",
  },
});
