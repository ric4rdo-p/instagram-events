import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "./Icon";
import { Grad, HostAvatar, MiniFaces, Photo, PlanAvatar, Tap } from "./common";
import { C } from "./theme";
import { dateLabel, friendPlans, getEvent } from "./data";

export function InterestButton({ active, onPress, style }) {
  return (
    <Tap onPress={onPress} style={[s.interest, active && { backgroundColor: C.chip }, style]}>
      {active ? <Icon name="check" size={16} color={C.ink} /> : null}
      <Text style={[s.interestText, active && { color: C.ink }]}>{active ? "Interested" : "I’m interested"}</Text>
    </Tap>
  );
}

export function EventCard({ event, onOpen }) {
  const { width } = useWindowDimensions();
  const [saved, setSaved] = useState(false);
  const [interested, setInterested] = useState(false);
  return (
    <View style={s.card}>
      <View style={s.author}>
        <HostAvatar gradient={event.gradient} label={event.avatar} size={32} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>{event.host}</Text>
          <Text style={{ color: C.muted, fontSize: 11 }} numberOfLines={1}>{event.reason}</Text>
        </View>
        <Icon name="more" />
      </View>
      <Tap onPress={onOpen} accessibilityLabel={`Open ${event.title}`}>
        <Photo uri={event.image} style={{ width, height: width }} />
        <LinearGradient colors={["rgba(0,0,0,0.12)", "transparent", "rgba(0,0,0,0.12)"]} locations={[0, 0.38, 1]} style={StyleSheet.absoluteFill} />
        <View style={s.pill}>
          <Icon name="calendar" size={14} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>Event</Text>
        </View>
        <View style={s.imageDate}>
          <Text style={{ color: C.pink, fontSize: 9, fontWeight: "700" }}>{event.weekday}</Text>
          <Text style={{ fontSize: 23, lineHeight: 25, fontWeight: "700", color: C.ink }}>{event.day}</Text>
          <Text style={{ fontSize: 9, color: C.muted }}>{event.month}</Text>
        </View>
      </Tap>
      <View style={{ paddingTop: 10, paddingHorizontal: 14 }}>
        <View style={s.actions}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <InterestButton active={interested} onPress={() => setInterested(!interested)} />
            <Tap style={s.roundAction} accessibilityLabel="Share">
              <Icon name="share" size={21} />
            </Tap>
          </View>
          <Tap onPress={() => setSaved(!saved)} accessibilityLabel={saved ? "Unsave" : "Save"} hitSlop={8}>
            <Icon name="bookmark" filled={saved} />
          </Tap>
        </View>
        <Tap onPress={onOpen} style={{ paddingTop: 10 }}>
          <Text style={s.eventDate}>{dateLabel(event)}</Text>
          <Text style={s.eventTitle}>{event.title}</Text>
          <View style={s.row3}>
            <Icon name="location" size={14} color={C.sub} />
            <Text style={{ color: C.sub, fontSize: 12 }}>{event.place}</Text>
          </View>
          <View style={[s.row3, { marginTop: 10 }]}>
            <MiniFaces />
            <Text style={{ fontSize: 11, color: C.sub }}>{event.social}</Text>
          </View>
        </Tap>
      </View>
    </View>
  );
}

// The horizontal card with a square photo on the left (.mini-event)
export function MiniEvent({ event, onPress, reason, height = 113 }) {
  return (
    <Tap onPress={onPress} style={[s.mini, { height }]}>
      <Photo uri={event.image} style={{ width: 103, height: "100%" }} />
      <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, minWidth: 0 }}>
        <Text style={s.pinkSmall}>{event.weekday}, {event.month} {event.day}</Text>
        <Text style={{ marginTop: 5, marginBottom: 4, fontSize: 13, fontWeight: "700", color: C.ink }} numberOfLines={2}>{event.title}</Text>
        <Text style={{ color: C.muted, fontSize: 11 }} numberOfLines={1}>{event.place}</Text>
        {reason ? <Text style={{ marginTop: "auto", color: C.ink, fontWeight: "600", fontSize: 11 }} numberOfLines={1}>{reason}</Text> : null}
      </View>
    </Tap>
  );
}

export function ResultRow({ event, onPress }) {
  return (
    <Tap onPress={onPress} style={s.resultRow}>
      <Photo uri={event.image} style={{ width: 104, height: 104, borderRadius: 8 }} />
      <View style={{ flex: 1, paddingTop: 2 }}>
        <Text style={s.pinkSmall}>{dateLabel(event)}</Text>
        <Text style={{ fontSize: 14, fontWeight: "700", marginVertical: 4, color: C.ink }}>{event.title}</Text>
        <Text style={{ color: C.sub, fontSize: 11 }}>{event.place}</Text>
        <Text style={{ marginTop: "auto", color: C.muted, fontSize: 10 }}>{event.social}</Text>
      </View>
    </Tap>
  );
}

export function AiAnswer({ count }) {
  return (
    <View style={s.aiAnswer}>
      <Icon name="sparkles" size={18} color={C.purple} />
      <Text style={{ flex: 1, fontSize: 13, lineHeight: 19, color: C.ink }}>
        I found <Text style={{ fontWeight: "700" }}>{count} {count === 1 ? "event" : "events"}</Text> that match. They’re close by, fit your usual saves, and friends are interested in some of them.
      </Text>
    </View>
  );
}

export function FriendPlansRow({ onOpenStory }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.planRow}>
      <View style={s.planItem}>
        <View style={[s.planRing, { backgroundColor: C.border }]}>
          <View style={[s.planInner, { backgroundColor: "#f5f5f5" }]}>
            <Icon name="calendar" size={22} />
          </View>
        </View>
        <Text style={s.planLabel}>Your plans</Text>
      </View>
      {friendPlans.map((plan, index) => (
        <Tap key={plan.user} style={s.planItem} onPress={() => onOpenStory(index)} accessibilityLabel={`${plan.user} is ${plan.status.toLowerCase()}: ${getEvent(plan.eventId).title}`}>
          <View>
            <Grad name="story" ring style={s.planRing}>
              <View style={s.planInnerBorder}>
                <PlanAvatar gradient={plan.gradient} initials={plan.initials} size={56} />
              </View>
            </Grad>
            <View style={[s.planBadge, plan.status === "Interested" && { backgroundColor: "#5b3fd1" }]}>
              <Text style={s.planBadgeText}>{plan.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={s.planLabel} numberOfLines={1}>{plan.user}</Text>
        </Tap>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  card: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border, paddingBottom: 14 },
  author: { height: 55, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  pill: {
    position: "absolute", top: 14, left: 14, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "rgba(0,0,0,0.48)", borderRadius: 20,
    flexDirection: "row", alignItems: "center", gap: 5,
  },
  imageDate: {
    position: "absolute", right: 14, bottom: 14, width: 54, height: 62, borderRadius: 9, backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  actions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  interest: { minHeight: 34, borderRadius: 8, backgroundColor: C.blue, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  interestText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  roundAction: { width: 36, height: 34, borderRadius: 8, backgroundColor: C.chip, alignItems: "center", justifyContent: "center" },
  eventDate: { color: C.pink, fontSize: 11, fontWeight: "700" },
  eventTitle: { fontSize: 17, fontWeight: "700", marginTop: 3, marginBottom: 4, color: C.ink },
  row3: { flexDirection: "row", alignItems: "center", gap: 3 },
  mini: { width: 250, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 12, overflow: "hidden", flexDirection: "row", backgroundColor: "#fff" },
  pinkSmall: { color: C.pink, fontSize: 10, fontWeight: "700", letterSpacing: 0.25 },
  resultRow: { flexDirection: "row", gap: 12, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  aiAnswer: { flexDirection: "row", gap: 10, marginTop: 18, marginBottom: 12 },
  planRow: { gap: 14, paddingTop: 4, paddingHorizontal: 16, paddingBottom: 16 },
  planItem: { width: 68, alignItems: "center", gap: 7 },
  planRing: { width: 66, height: 66, borderRadius: 33, padding: 3, alignItems: "center", justifyContent: "center" },
  planInner: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: "#fff", alignItems: "center", justifyContent: "center" },
  planInnerBorder: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  planBadge: {
    position: "absolute", bottom: -6, alignSelf: "center", paddingHorizontal: 6, paddingVertical: 1, borderRadius: 5, borderWidth: 2, borderColor: "#fff", backgroundColor: C.pink,
  },
  planBadgeText: { color: "#fff", fontSize: 8, fontWeight: "800", letterSpacing: 0.3 },
  planLabel: { fontSize: 12, maxWidth: 72, color: C.ink },
});
