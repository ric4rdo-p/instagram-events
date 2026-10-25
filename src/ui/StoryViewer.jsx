import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "./Icon";
import { PlanAvatar, Tap } from "./common";
import { InterestButton } from "./eventParts";
import { C } from "./theme";
import { friendPlans, getEvent } from "./data";

const STORY_MS = 5000;

export default function StoryViewer({ index, onIndex, onClose, onOpenEvent }) {
  const insets = useSafeAreaInsets();
  const plan = friendPlans[index];
  const event = getEvent(plan.eventId);
  const [interested, setInterested] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const next = () => (index < friendPlans.length - 1 ? onIndex(index + 1) : onClose());
  const prev = () => onIndex(Math.max(0, index - 1));

  useEffect(() => {
    setInterested(false);
    progress.setValue(0);
    const anim = Animated.timing(progress, { toValue: 1, duration: STORY_MS, easing: Easing.linear, useNativeDriver: false });
    anim.start(({ finished }) => finished && next());
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <Modal visible animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <View style={s.frame}>
        <Image source={{ uri: event.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={["rgba(0,0,0,0.45)", "transparent", "transparent", "rgba(0,0,0,0.65)"]}
          locations={[0, 0.28, 0.5, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Pressable style={[s.tap, { left: 0, width: "35%", top: insets.top + 70 }]} onPress={prev} accessibilityLabel="Previous story" />
        <Pressable style={[s.tap, { right: 0, width: "65%", top: insets.top + 70 }]} onPress={next} accessibilityLabel="Next story" />
        <View style={[s.progress, { top: insets.top + 10 }]}>
          {friendPlans.map((p, i) => (
            <View key={p.user} style={s.bar}>
              {i < index ? <View style={[s.fill, { width: "100%" }]} /> : null}
              {i === index ? <Animated.View style={[s.fill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} /> : null}
            </View>
          ))}
        </View>
        <View style={[s.head, { top: insets.top + 20 }]}>
          <PlanAvatar gradient={plan.gradient} initials={plan.initials} size={32} fontSize={11} />
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>{plan.user}</Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{plan.ago}</Text>
          <Tap style={s.close} onPress={onClose} accessibilityLabel="Close story">
            <Icon name="close" color="#fff" />
          </Tap>
        </View>
        <View style={[s.sticker, { bottom: insets.bottom + 36 }]}>
          <View style={s.status}>
            <Icon name={plan.status === "Going" ? "check" : "sparkles"} size={15} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>{plan.user} is {plan.status.toLowerCase()}</Text>
          </View>
          <StickerCard event={event} onPress={() => onOpenEvent(event.id)} />
          <View style={s.stickerActions}>
            <InterestButton active={interested} onPress={() => setInterested(!interested)} style={{ flex: 1, minHeight: 42 }} />
            <Tap style={s.view} onPress={() => onOpenEvent(event.id)}>
              <Text style={{ color: C.ink, fontSize: 13, fontWeight: "700" }}>View event</Text>
            </Tap>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function StickerCard({ event, onPress, day, month, topLine, compact = false }) {
  const body = (
    <>
      <View style={s.stickerDate}>
        <Text style={{ fontSize: 20, lineHeight: 22, fontWeight: "700", color: C.ink }}>{day ?? event.day}</Text>
        <Text style={{ fontSize: 9, fontWeight: "700", color: C.pink }}>{month ?? event.month}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 10, color: C.pink, fontWeight: "700" }} numberOfLines={1}>{topLine ?? `${event.weekday} • ${event.time}`}</Text>
        <Text style={{ fontSize: compact ? 13 : 15, fontWeight: "700", marginVertical: 2, color: C.ink }} numberOfLines={2}>{event.title}</Text>
        <Text style={{ fontSize: 11, color: C.muted }} numberOfLines={1}>{event.place}</Text>
      </View>
    </>
  );
  const style = [s.card, compact && { padding: 10, gap: 10 }];
  return onPress ? <Tap style={style} onPress={onPress}>{body}</Tap> : <View style={style}>{body}</View>;
}

const s = StyleSheet.create({
  frame: { flex: 1, backgroundColor: "#000" },
  tap: { position: "absolute", bottom: 0 },
  progress: { position: "absolute", left: 8, right: 8, flexDirection: "row", gap: 4 },
  bar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.35)", overflow: "hidden" },
  fill: { height: "100%", backgroundColor: "#fff" },
  head: { position: "absolute", left: 12, right: 4, flexDirection: "row", alignItems: "center", gap: 9 },
  close: { marginLeft: "auto", width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  sticker: { position: "absolute", left: 18, right: 18, alignItems: "center", gap: 10 },
  status: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.55)", paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20 },
  card: {
    alignSelf: "stretch", backgroundColor: "#fff", borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", gap: 12,
    shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 6,
  },
  stickerDate: { width: 48, height: 54, borderRadius: 9, backgroundColor: "#fff0f6", alignItems: "center", justifyContent: "center" },
  stickerActions: { alignSelf: "stretch", flexDirection: "row", gap: 8 },
  view: { flex: 1, minHeight: 42, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.94)", alignItems: "center", justifyContent: "center" },
});
