import { useEffect, useRef } from "react";
import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Switch as RNSwitch, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "./Icon";
import { C, DIAG, GRADIENT_COLORS, RING } from "./theme";

export function Tap({ style, children, disabled, ...rest }) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [style, pressed && !disabled && { opacity: 0.6 }]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

export function Grad({ name, colors, ring = false, style, children }) {
  const dir = ring ? RING : DIAG;
  return (
    <LinearGradient colors={colors ?? GRADIENT_COLORS[name]} start={dir.start} end={dir.end} style={style}>
      {children}
    </LinearGradient>
  );
}

// A photo with an optional color wash standing in for the design's CSS filters
export function Photo({ uri, style, tint, dim }) {
  return (
    <View style={[{ overflow: "hidden", backgroundColor: C.chip }, style]}>
      <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
      {tint ? <View style={[StyleSheet.absoluteFill, { backgroundColor: tint }]} /> : null}
      {dim ? <View style={[StyleSheet.absoluteFill, { backgroundColor: dim }]} /> : null}
    </View>
  );
}

// Round gradient avatar with initials (the design's .host-avatar has a pink outline)
export function HostAvatar({ gradient, label, size = 36, outlined = true }) {
  const inner = (
    <Grad name={gradient} style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#fff", fontSize: Math.round(size * 0.31), fontWeight: "800" }}>{label}</Text>
    </Grad>
  );
  if (!outlined) return inner;
  return (
    <View style={{ borderRadius: (size + 8) / 2, borderWidth: 2, borderColor: "#d62976", padding: 2, backgroundColor: "#fff" }}>{inner}</View>
  );
}

export function PlanAvatar({ gradient = "violet", initials, size = 60, fontSize = 15, style }) {
  return (
    <Grad name={gradient} style={[{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }, style]}>
      <Text style={{ color: "#fff", fontWeight: "800", fontSize }}>{initials}</Text>
    </Grad>
  );
}

export function ProfilePic({ size = 44, active = false }) {
  const pic = (
    <Grad name="profile" style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#493234", fontWeight: "700", fontSize: Math.round(size * 0.4) }}>A</Text>
    </Grad>
  );
  if (!active) return pic;
  return <View style={{ borderWidth: 2, borderColor: C.ink, borderRadius: (size + 6) / 2, padding: 1 }}>{pic}</View>;
}

const faceColors = ["#9871b2", "#db8c62", "#558da7"];
export function MiniFaces({ size = 20 }) {
  return (
    <View style={{ flexDirection: "row", paddingRight: 7 }}>
      {["M", "J", "S"].map((l, i) => (
        <View
          key={l}
          style={{
            width: size, height: size, borderRadius: size / 2, backgroundColor: faceColors[i], borderWidth: 2, borderColor: "#fff",
            alignItems: "center", justifyContent: "center", marginRight: i < 2 ? -6 : 0,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 8 }}>{l}</Text>
        </View>
      ))}
    </View>
  );
}

export function Switch({ checked, onChange }) {
  return (
    <RNSwitch
      value={checked}
      onValueChange={onChange}
      trackColor={{ false: C.border, true: C.blue }}
      ios_backgroundColor={C.border}
      thumbColor="#fff"
    />
  );
}

export function Segmented({ options, value, onChange, wide = false, style }) {
  return (
    <View style={[s.segmented, wide && { alignSelf: "stretch" }, style]}>
      {options.map((o) => {
        const active = value === o.id;
        return (
          <Tap key={o.id} onPress={() => onChange(o.id)} style={[s.segmentButton, wide && { flex: 1 }, active && s.segmentActive]}>
            <Text style={[s.segmentText, active && { color: C.ink }]}>{o.label}</Text>
          </Tap>
        );
      })}
    </View>
  );
}

export function Chip({ label, active, onPress, style }) {
  return (
    <Tap onPress={onPress} style={[s.chip, active && { backgroundColor: C.ink }, style]}>
      <Text style={[s.chipText, active && { color: "#fff" }]}>{label}</Text>
    </Tap>
  );
}

// Pulsing placeholder shown while Muse "generates" something
export function Shimmer({ style }) {
  const pulse = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 550, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 550, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "#e4e4e4", opacity: pulse }, style]} />;
}

export function MuseOrb({ size = 35, iconSize = 22 }) {
  return (
    <Grad name="muse" style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }}>
      <Icon name="sparkles" size={iconSize} color="#fff" />
    </Grad>
  );
}

// Bottom sheet modal used by every overlay that slides up from the bottom
export function BottomModal({ visible = true, onClose, children, style }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <KeyboardAvoidingView style={s.backdropWrap} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={[StyleSheet.absoluteFill, s.backdrop]} onPress={onClose} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + 8, maxHeight: "92%" }, style]}>{children}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function ActionSheet({ title, description, options, onClose }) {
  return (
    <BottomModal onClose={onClose}>
      <Text style={s.sheetTitle}>{title}</Text>
      {description ? <Text style={s.sheetDesc}>{description}</Text> : null}
      {options.map((option) => (
        <Tap
          key={option.label}
          style={s.sheetButton}
          onPress={() => {
            option.onSelect();
            if (option.closes !== false) onClose();
          }}
        >
          <Text style={[s.sheetButtonText, option.destructive && { color: C.danger, fontWeight: "700" }, option.selected && { fontWeight: "700" }]}>{option.label}</Text>
          {option.selected ? <Icon name="check" size={18} /> : null}
        </Tap>
      ))}
      <Tap style={s.sheetButton} onPress={onClose}>
        <Text style={s.sheetButtonText}>Cancel</Text>
      </Tap>
    </BottomModal>
  );
}

export function Toast({ toast, onDone, bottom }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const timer = setTimeout(onDone, 5000);
    return () => clearTimeout(timer);
  }, [toast, onDone, opacity]);
  return (
    <Animated.View style={[s.toast, { bottom, opacity }]} pointerEvents="box-none">
      <Text style={s.toastText}>{toast.message}</Text>
      {toast.actionLabel ? (
        <Tap
          onPress={() => {
            toast.onAction?.();
            onDone();
          }}
          style={{ minHeight: 36, justifyContent: "center" }}
        >
          <Text style={{ color: "#7cc4ff", fontWeight: "700", fontSize: 13 }}>{toast.actionLabel}</Text>
        </Tap>
      ) : null}
    </Animated.View>
  );
}

export function Logo({ height = 30 }) {
  return (
    <Image source={require("../../assets/images/header-logo.png")} style={{ height, width: height * 2.8 }} contentFit="contain" tintColor="#000" />
  );
}

// Matches the design's mobile .topbar: logo or back on the left, optional title, actions on the right
export function TopBar({ title, onBack, right, showTitle = false }) {
  return (
    <View style={s.topbar}>
      <View style={[s.topbarSide, { justifyContent: "flex-start" }]}>
        {onBack ? (
          <Tap onPress={onBack} hitSlop={10} accessibilityLabel="Back">
            <Icon name="back" />
          </Tap>
        ) : (
          <Logo />
        )}
      </View>
      {showTitle ? <Text style={s.topbarTitle}>{title}</Text> : null}
      <View style={[s.topbarSide, { justifyContent: "flex-end" }]}>{right ?? <Icon name="heart" />}</View>
    </View>
  );
}

export function MobileNav({ active, onNavigate }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.nav, { paddingBottom: insets.bottom }]}>
      <Tap style={s.navButton} onPress={() => onNavigate("home")} accessibilityLabel="Home">
        <Icon name="home" filled={active === "home"} />
      </Tap>
      <Tap style={s.navButton} onPress={() => onNavigate("search")} accessibilityLabel="Search">
        <Icon name="search" bold={active === "search"} />
      </Tap>
      <Tap style={s.navButton} accessibilityLabel="Reels">
        <Icon name="reels" />
      </Tap>
      <Tap style={s.navButton} accessibilityLabel="Messages">
        <Icon name="message" />
      </Tap>
      <Tap style={s.navButton} onPress={() => onNavigate("profile")} accessibilityLabel="Profile">
        <ProfilePic size={24} active={active === "profile"} />
      </Tap>
    </View>
  );
}

export const NAV_HEIGHT = 50;

// Section heading used across Events, Search and Detail
export function SectionHeading({ title, sub, action, onAction, style }) {
  return (
    <View style={[s.sectionHeading, style]}>
      <View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: C.ink }}>{title}</Text>
        {sub ? <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{sub}</Text> : null}
      </View>
      {action ? (
        <Tap onPress={onAction}>
          <Text style={{ color: C.blue, fontWeight: "600", fontSize: 13 }}>{action}</Text>
        </Tap>
      ) : null}
    </View>
  );
}

// True when a ScrollView is within ~600px of its end (stands in for IntersectionObserver)
export const nearBottom = ({ nativeEvent: { layoutMeasurement, contentOffset, contentSize } }) =>
  layoutMeasurement.height + contentOffset.y >= contentSize.height - 600;

const s = StyleSheet.create({
  segmented: { flexDirection: "row", backgroundColor: C.chip, borderRadius: 9, padding: 2, alignSelf: "flex-start" },
  segmentButton: { height: 32, paddingHorizontal: 12, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  segmentActive: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  segmentText: { fontSize: 13, fontWeight: "600", color: C.muted },
  chip: { height: 32, paddingHorizontal: 14, borderRadius: 8, backgroundColor: C.chip, alignItems: "center", justifyContent: "center" },
  chipText: { fontSize: 13, fontWeight: "600", color: C.ink },
  backdropWrap: { flex: 1, justifyContent: "flex-end" },
  backdrop: { backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: "hidden" },
  sheetTitle: { textAlign: "center", paddingTop: 18, paddingHorizontal: 20, paddingBottom: 6, fontSize: 16, fontWeight: "700", color: C.ink },
  sheetDesc: { textAlign: "center", paddingHorizontal: 24, paddingBottom: 14, fontSize: 13, color: C.muted, lineHeight: 18 },
  sheetButton: { minHeight: 48, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  sheetButtonText: { fontSize: 14, color: C.ink },
  toast: {
    position: "absolute", left: 12, right: 12, backgroundColor: "#262626", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14,
    flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  toastText: { flex: 1, color: "#fff", fontSize: 13, lineHeight: 18 },
  topbar: {
    height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.hairline, backgroundColor: "#fff",
  },
  topbarSide: { flex: 1, flexDirection: "row", alignItems: "center", gap: 20 },
  topbarTitle: { fontSize: 16, fontWeight: "700", color: C.ink },
  nav: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border, backgroundColor: "rgba(255,255,255,0.97)" },
  navButton: { flex: 1, height: NAV_HEIGHT, alignItems: "center", justifyContent: "center" },
  sectionHeading: { paddingTop: 13, paddingHorizontal: 16, paddingBottom: 10, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
});
