import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Image, StyleSheet, View } from "react-native";

import { colors, radii } from "@/theme/tokens";

export function ContactHeroMark() {
  const drift = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) {
          setReduceMotionEnabled(enabled);
        }
      })
      .catch(() => {
        if (mounted) {
          setReduceMotionEnabled(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (reduceMotionEnabled) {
      drift.stopAnimation();
      pulse.stopAnimation();
      drift.setValue(0);
      pulse.setValue(0);
      return;
    }

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 2600,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: true
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 2600,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: true
        })
      ])
    );

    const accentLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true
        })
      ])
    );

    floatLoop.start();
    accentLoop.start();

    return () => {
      floatLoop.stop();
      accentLoop.stop();
    };
  }, [drift, pulse, reduceMotionEnabled]);

  const clusterTranslateY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const handleRotate = drift.interpolate({
    inputRange: [0, 1],
    outputRange: ["-3deg", "1deg"]
  });

  const bookmarkTranslate = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4]
  });

  const highlightOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.74, 1]
  });

  return (
    <View style={styles.shell}>
      <View style={styles.aura} />

      <Animated.View
        style={[
          styles.cluster,
          !reduceMotionEnabled ? { transform: [{ translateY: clusterTranslateY }] } : undefined
        ]}
      >
        <Animated.View
          style={[
            styles.imageWrap,
            !reduceMotionEnabled
              ? {
                  transform: [
                    { perspective: 900 },
                    { rotateZ: handleRotate },
                    { translateY: bookmarkTranslate }
                  ]
                }
              : undefined
          ]}
        >
          <Image
            source={require("../../assets/hero-book.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Animated.View style={[styles.imageHighlight, { opacity: highlightOpacity }]} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: "center",
    height: 256,
    justifyContent: "center",
    marginBottom: 8,
    width: 286
  },
  aura: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 120,
    height: 212,
    opacity: 0.95,
    position: "absolute",
    top: 18,
    width: 212
  },
  cluster: {
    alignItems: "center",
    height: 206,
    justifyContent: "center",
    width: 246
  },
  imageWrap: {
    alignItems: "center",
    height: 212,
    justifyContent: "center",
    width: 244
  },
  image: {
    height: 212,
    width: 244
  },
  imageHighlight: {
    backgroundColor: "rgba(255, 199, 103, 0.18)",
    borderRadius: 72,
    height: 74,
    left: 44,
    position: "absolute",
    top: 28,
    transform: [{ rotate: "-16deg" }],
    width: 110
  }
});
