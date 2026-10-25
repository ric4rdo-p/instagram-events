import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Icon from "./Icon";
import { Photo, ProfilePic, Segmented, Switch, Tap, nearBottom } from "./common";
import { C } from "./theme";
import { ME, attendedEvents, dateLabel, hostedPast, hostedStats, photoList } from "./data";

const tabs = [
  { id: "posts", icon: "grid", label: "Posts" },
  { id: "reels", icon: "reels", label: "Reels" },
  { id: "events", icon: "calendar", label: "Events" },
  { id: "reposts", icon: "repost", label: "Reposts" },
  { id: "tagged", icon: "tag", label: "Tagged" },
];
const views = [
  { id: "hosting", label: "Hosting" },
  { id: "past", label: "Past" },
  { id: "attended", label: "Went to" },
];

function Grid({ count, offset, ratio }) {
  const { width } = useWindowDimensions();
  const tile = (width - 4) / 3;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
      {Array.from({ length: count }, (_, i) => (
        <Photo key={i} uri={photoList[(i + offset) % photoList.length]} style={{ width: tile, height: tile * ratio }} />
      ))}
    </View>
  );
}

export default function ProfileScreen({ hosted, initialTab = "posts", onCreate, onOpenEvent, onSettings }) {
  const [tab, setTab] = useState(initialTab);
  const [eventsView, setEventsView] = useState("hosting");
  const [wentToPrivate, setWentToPrivate] = useState(false);
  const [anonymous, setAnonymous] = useState({});
  const [gridCount, setGridCount] = useState({ posts: 12, reels: 9 });

  return (
    <View style={{ flex: 1 }}>
      <View style={s.topbar}>
        <Text style={{ fontSize: 20, fontWeight: "700", letterSpacing: -0.3, color: C.ink }}>{ME}</Text>
        <View style={{ flexDirection: "row" }}>
          <Tap style={s.icon44} onPress={onCreate} accessibilityLabel="Create">
            <Icon name="plus" />
          </Tap>
          <Tap style={s.icon44} onPress={onSettings} accessibilityLabel="Settings">
            <Icon name="menu" />
          </Tap>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        onScroll={(e) => {
          if ((tab === "posts" || tab === "reels") && nearBottom(e)) setGridCount((g) => ({ ...g, [tab]: g[tab] + (tab === "posts" ? 12 : 9) }));
        }}
        scrollEventThrottle={200}
      >
        <View style={s.head}>
          <ProfilePic size={86} />
          <View style={s.stats}>
            {[
              ["48", "posts"],
              ["1,204", "followers"],
              ["389", "following"],
            ].map(([n, label]) => (
              <View key={label} style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: C.ink }}>{n}</Text>
                <Text style={{ fontSize: 13, color: C.ink }}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>Ahmed</Text>
          <Text style={{ fontSize: 14, marginTop: 2, lineHeight: 20, color: C.ink }}>
            Hosting community nights around the Bay. Board games, swap meets, and good people.
          </Text>
        </View>
        <View style={s.actions}>
          {["Edit profile", "Share profile"].map((label) => (
            <Tap key={label} style={s.actionButton}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: C.ink }}>{label}</Text>
            </Tap>
          ))}
        </View>
        <View style={s.tabs}>
          {tabs.map((t) => (
            <Tap key={t.id} style={[s.tab, tab === t.id && { borderBottomColor: C.ink }]} onPress={() => setTab(t.id)} accessibilityLabel={t.label}>
              <Icon name={t.icon} size={22} color={tab === t.id ? C.ink : C.muted} />
            </Tap>
          ))}
        </View>
        {tab === "events" ? (
          <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
            <View style={s.hostedHead}>
              <Segmented options={views} value={eventsView} onChange={setEventsView} />
              <Tap style={s.hostCta} onPress={onCreate}>
                <Icon name="plus" size={16} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Host</Text>
              </Tap>
            </View>
            {eventsView === "hosting" &&
              hosted.map((event) => (
                <Tap key={event.id} style={s.hostedRow} onPress={() => onOpenEvent(event.id)}>
                  <Photo uri={event.image} tint={event.imageTint} style={{ width: 72, height: 90, borderRadius: 8 }} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={s.pinkSmall}>{dateLabel(event)}</Text>
                    <Text style={s.rowTitle}>{event.title}</Text>
                    <Text style={{ fontSize: 12, color: C.muted }}>{hostedStats[event.id] ?? "No RSVPs yet"}</Text>
                  </View>
                  <View style={s.tag}>
                    <Text style={s.tagText}>Manage</Text>
                  </View>
                </Tap>
              ))}
            {eventsView === "past" &&
              hostedPast.map((event) => (
                <View key={event.id} style={s.hostedRow}>
                  <Photo uri={event.image} style={{ width: 72, height: 90, borderRadius: 8 }} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={s.pinkSmall}>{event.date}</Text>
                    <Text style={s.rowTitle}>{event.title}</Text>
                    <Text style={{ fontSize: 12, color: C.muted }}>{event.stats}</Text>
                  </View>
                  <View style={s.tag}>
                    <Text style={s.tagText}>Recap</Text>
                  </View>
                </View>
              ))}
            {eventsView === "attended" ? (
              <>
                <View style={s.privacyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: C.ink }}>Keep Went to private</Text>
                    <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      {wentToPrivate ? "Only you can see the events you went to." : "Your followers can see the events you went to."}
                    </Text>
                  </View>
                  <Switch checked={wentToPrivate} onChange={setWentToPrivate} />
                </View>
                {wentToPrivate ? (
                  <View style={s.privacyBanner}>
                    <Icon name="lock" size={14} color="#333" />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#333" }}>Only you can see this list</Text>
                  </View>
                ) : null}
                {attendedEvents.map((event) => {
                  const hidden = Boolean(anonymous[event.id]);
                  return (
                    <View key={event.id} style={s.attendedRow}>
                      <Photo uri={event.image} dim={hidden ? "rgba(255,255,255,0.5)" : undefined} style={{ width: 72, height: 96, borderRadius: 8 }} />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={s.pinkSmall}>{event.date}</Text>
                        <Text style={[s.rowTitle, { marginBottom: 1 }]}>{event.title}</Text>
                        <Text style={{ fontSize: 12, color: C.muted }}>Hosted by {event.host}</Text>
                        {hidden ? (
                          <Text style={{ marginTop: 6, fontSize: 12, color: C.sub, lineHeight: 17 }}>
                            You’re anonymous here. Your name is hidden from the guest list, and this event doesn’t appear on your profile for others.
                          </Text>
                        ) : null}
                      </View>
                      <Tap
                        style={[s.anonToggle, hidden && { backgroundColor: C.ink }]}
                        onPress={() => setAnonymous((a) => ({ ...a, [event.id]: !hidden }))}
                        accessibilityLabel={hidden ? `Show ${event.title} on your profile` : `Make ${event.title} anonymous`}
                      >
                        <Icon name={hidden ? "eyeOff" : "eye"} size={16} color={hidden ? "#fff" : C.ink} />
                        <Text style={{ fontSize: 12, fontWeight: "700", color: hidden ? "#fff" : C.ink }}>{hidden ? "Anonymous" : "Visible"}</Text>
                      </Tap>
                    </View>
                  );
                })}
              </>
            ) : null}
          </View>
        ) : null}
        {tab === "posts" ? <Grid count={gridCount.posts} offset={0} ratio={4 / 3} /> : null}
        {tab === "reels" ? <Grid count={gridCount.reels} offset={2} ratio={16 / 9} /> : null}
        {tab === "reposts" || tab === "tagged" ? <Grid count={3} offset={tab === "reposts" ? 2 : 3} ratio={4 / 3} /> : null}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  topbar: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 16, paddingRight: 6, backgroundColor: "#fff" },
  icon44: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  head: { flexDirection: "row", alignItems: "center", gap: 24, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 12 },
  stats: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  actions: { flexDirection: "row", gap: 6, paddingTop: 12, paddingHorizontal: 16, paddingBottom: 14 },
  actionButton: { flex: 1, height: 34, borderRadius: 8, backgroundColor: C.chip, alignItems: "center", justifyContent: "center" },
  tabs: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border },
  tab: { flex: 1, height: 46, alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "transparent" },
  hostedHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 },
  hostCta: { height: 34, paddingHorizontal: 12, borderRadius: 8, backgroundColor: C.blue, flexDirection: "row", alignItems: "center", gap: 5 },
  hostedRow: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  pinkSmall: { color: C.pink, fontSize: 10, fontWeight: "700" },
  rowTitle: { fontSize: 14, fontWeight: "700", marginVertical: 3, color: C.ink },
  tag: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: C.chip },
  tagText: { fontSize: 12, fontWeight: "700", color: C.ink },
  privacyRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 58, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  privacyBanner: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10, marginBottom: 2, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, backgroundColor: "#f5f5f5" },
  attendedRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  anonToggle: { alignSelf: "center", height: 32, paddingHorizontal: 10, borderRadius: 8, backgroundColor: C.chip, flexDirection: "row", alignItems: "center", gap: 5 },
});
