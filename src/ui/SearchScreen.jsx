import { useMemo, useRef, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "./Icon";
import { Grad, MuseOrb, Photo, PlanAvatar, SectionHeading, Tap, nearBottom } from "./common";
import { AiAnswer, ResultRow } from "./eventParts";
import { C } from "./theme";
import {
  accounts, feedEvents, getEvent, initialRecents, photoList, photos, reelViews, searchEvents, searchPool, searchPosts, searchReels, searchSuggestions, venueFor,
} from "./data";

function ReelsGrid({ count }) {
  const { width } = useWindowDimensions();
  const tile = (width - 4) / 3;
  return (
    <View style={s.reels}>
      {Array.from({ length: count }, (_, i) => {
        const views = reelViews[i % reelViews.length];
        return (
          <Tap key={i} style={{ width: tile, height: (tile * 16) / 9 }} accessibilityLabel={`Reel, ${views} views`}>
            <Photo uri={photoList[(i * 2 + 1) % photoList.length]} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.5)"]} style={[StyleSheet.absoluteFill, { top: "65%" }]} />
            <View style={s.reelViews}>
              <Icon name="play" size={13} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{views}</Text>
            </View>
          </Tap>
        );
      })}
    </View>
  );
}

function ResultSection({ title, total, limit, expanded, onToggle, children }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHead}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: C.ink }}>{title}</Text>
        {total > limit ? (
          <Tap onPress={onToggle} hitSlop={8}>
            <Text style={{ color: C.blue, fontWeight: "600", fontSize: 13 }}>{expanded ? "See less" : "See more"}</Text>
          </Tap>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function AccountRow({ account }) {
  const [following, setFollowing] = useState(Boolean(account.following));
  return (
    <View style={s.accountRow}>
      <PlanAvatar gradient={account.gradient} initials={account.user.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase()} size={44} fontSize={13} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: C.ink }} numberOfLines={1}>{account.user}</Text>
        <Text style={{ fontSize: 12, color: C.muted }} numberOfLines={1}>{account.name} • {account.followers} followers</Text>
        <Text style={{ fontSize: 12, color: C.muted }} numberOfLines={1}>{account.note}</Text>
      </View>
      <Tap onPress={() => setFollowing(!following)} style={[s.follow, following && { backgroundColor: C.chip }]}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: following ? C.ink : "#fff" }}>{following ? "Following" : "Follow"}</Text>
      </Tap>
    </View>
  );
}

function MediaGrid({ items, reel }) {
  const { width } = useWindowDimensions();
  const tile = (width - 32 - 4) / 3;
  return (
    <View style={s.mediaGrid}>
      {items.map((item) => (
        <Tap key={item.id} style={{ width: tile, height: reel ? (tile * 16) / 9 : tile }} accessibilityLabel={`${item.user}: ${item.text}`}>
          <Photo uri={item.image} style={StyleSheet.absoluteFill} />
          {reel ? (
            <>
              <LinearGradient colors={["transparent", "rgba(0,0,0,0.5)"]} style={[StyleSheet.absoluteFill, { top: "65%" }]} />
              <View style={s.reelViews}>
                <Icon name="play" size={13} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{item.views}</Text>
              </View>
            </>
          ) : null}
        </Tap>
      ))}
    </View>
  );
}

const LIMITS = { accounts: 3, posts: 6, reels: 3, events: 3 };

export default function SearchScreen({ onOpen }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [recents, setRecents] = useState(initialRecents);
  const [reelCount, setReelCount] = useState(18);
  const results = useMemo(() => searchEvents(query, feedEvents), [query]);
  const accountResults = useMemo(() => searchPool(query, accounts, (a) => `${a.user} ${a.name} ${a.tags}`), [query]);
  const postResults = useMemo(() => searchPool(query, searchPosts, (p) => `${p.user} ${p.text}`), [query]);
  const reelResults = useMemo(() => searchPool(query, searchReels, (r) => `${r.user} ${r.text}`), [query]);
  const [expanded, setExpanded] = useState({});
  const toggleSection = (key) => setExpanded((e) => ({ ...e, [key]: !e[key] }));
  const visible = (key, list) => (expanded[key] ? list : list.slice(0, LIMITS[key]));
  const remember = (item) => setRecents((r) => [item, ...r.filter((x) => x.label !== item.label)].slice(0, 8));
  const runSearch = (text) => {
    const q = text.trim();
    if (!q) return;
    setQuery(q);
    setExpanded({});
    remember({ type: "query", label: q });
  };
  const openRecent = (item) => {
    if (item.type === "event" && item.eventId) {
      remember(item);
      onOpen(item.eventId);
      return;
    }
    runSearch(item.label);
  };
  const cancel = () => {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={s.top}>
        <View style={s.input}>
          <Icon name="search" size={19} color={C.muted} />
          <TextInput
            ref={inputRef}
            value={query}
            onFocus={() => setFocused(true)}
            onChangeText={setQuery}
            onSubmitEditing={() => runSearch(query)}
            placeholder="Search or ask Muse"
            placeholderTextColor={C.muted}
            returnKeyType="search"
            style={s.inputText}
            accessibilityLabel="Search"
          />
          {query ? (
            <Tap onPress={() => setQuery("")} accessibilityLabel="Clear search" hitSlop={8}>
              <Icon name="close" size={17} color={C.muted} />
            </Tap>
          ) : null}
        </View>
        {focused || query ? (
          <Tap onPress={cancel} style={{ minHeight: 44, justifyContent: "center" }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: C.ink }}>Cancel</Text>
          </Tap>
        ) : null}
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        onScroll={(e) => !query && !focused && nearBottom(e) && setReelCount((c) => c + 12)}
        scrollEventThrottle={200}
      >
        {query ? (
          <>
            <ResultSection title="Accounts" total={accountResults.length} limit={LIMITS.accounts} expanded={expanded.accounts} onToggle={() => toggleSection("accounts")}>
              {visible("accounts", accountResults).map((a) => (
                <AccountRow key={a.user} account={a} />
              ))}
            </ResultSection>
            <ResultSection title="Posts" total={postResults.length} limit={LIMITS.posts} expanded={expanded.posts} onToggle={() => toggleSection("posts")}>
              <MediaGrid items={visible("posts", postResults)} />
            </ResultSection>
            <ResultSection title="Reels" total={reelResults.length} limit={LIMITS.reels} expanded={expanded.reels} onToggle={() => toggleSection("reels")}>
              <MediaGrid items={visible("reels", reelResults)} reel />
            </ResultSection>
            <ResultSection title="Events" total={results.length} limit={LIMITS.events} expanded={expanded.events} onToggle={() => toggleSection("events")}>
              <AiAnswer count={results.length} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, marginBottom: 4 }}>
                {["All dates", "Nearby", "Under $20"].map((f) => (
                  <Tap key={f} style={s.filterChip}>
                    <Text style={{ fontSize: 12, color: C.ink }}>{f}</Text>
                  </Tap>
                ))}
              </ScrollView>
              {visible("events", results).map((event) => (
                <ResultRow
                  key={event.id}
                  event={event}
                  onPress={() => {
                    remember({ type: "event", label: event.title, sub: `${event.weekday}, ${event.month} ${event.day} • ${venueFor(event).name}`, eventId: event.id });
                    onOpen(event.id);
                  }}
                />
              ))}
            </ResultSection>
          </>
        ) : focused ? (
          <>
            <View style={{ marginTop: 4 }}>
              <View style={s.recentHeading}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: C.ink }}>Recent</Text>
                {recents.length > 0 ? (
                  <Tap onPress={() => setRecents([])}>
                    <Text style={{ color: C.blue, fontWeight: "600", fontSize: 13 }}>Clear all</Text>
                  </Tap>
                ) : null}
              </View>
              {recents.length === 0 ? <Text style={{ color: C.muted, fontSize: 13, marginTop: 4, marginBottom: 8 }}>No recent searches.</Text> : null}
              {recents.map((item) => (
                <View style={s.recentRow} key={`${item.type}-${item.label}`}>
                  <Tap style={s.recentMain} onPress={() => openRecent(item)}>
                    {item.type === "account" ? (
                      <PlanAvatar gradient={item.gradient ?? "violet"} initials={item.initials} size={44} fontSize={13} />
                    ) : item.type === "event" && item.eventId ? (
                      <Photo uri={getEvent(item.eventId).image} style={{ width: 44, height: 44, borderRadius: 8 }} />
                    ) : (
                      <View style={s.recentIcon}>
                        <Icon name="search" size={20} />
                      </View>
                    )}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: C.ink }} numberOfLines={1}>{item.label}</Text>
                      {item.sub ? <Text style={{ fontSize: 12, color: C.muted }} numberOfLines={1}>{item.sub}</Text> : null}
                    </View>
                  </Tap>
                  <Tap style={s.recentRemove} onPress={() => setRecents((r) => r.filter((x) => x !== item))} accessibilityLabel={`Remove ${item.label} from recent searches`}>
                    <Icon name="close" size={16} color={C.muted} />
                  </Tap>
                </View>
              ))}
            </View>
            <View style={{ marginTop: 17 }}>
              <SectionHeading title="Try asking" style={{ paddingHorizontal: 0 }} />
              {searchSuggestions.map((suggestion) => (
                <Tap key={suggestion} style={s.suggestion} onPress={() => runSearch(suggestion)}>
                  <Icon name="sparkles" size={17} color={C.purple} />
                  <Text style={{ flex: 1, fontSize: 13, color: C.ink }}>{suggestion}</Text>
                  <Icon name="chevron" size={18} />
                </Tap>
              ))}
            </View>
          </>
        ) : (
          <>
            <Grad colors={["#f7efff", "#fff2f6", "#fff8ed"]} style={s.museCard}>
              <MuseOrb />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>Ask Muse to find your plans</Text>
                <Text style={{ marginTop: 5, fontSize: 12, color: C.sub, lineHeight: 17 }}>
                  Describe your mood, budget, or who you’re with. Muse searches public events across Instagram and Facebook.
                </Text>
              </View>
            </Grad>
            <View style={{ marginTop: 17 }}>
              <SectionHeading title="Browse by vibe" style={{ paddingHorizontal: 0 }} />
              <View style={s.vibeGrid}>
                {["Active", "Creative", "Social", "Outdoors"].map((vibe, index) => (
                  <Tap key={vibe} style={s.vibe} onPress={() => runSearch(`${vibe.toLowerCase()} events`)}>
                    <Photo uri={[photos.dance, photos.festival, photos.hero, photos.market][index]} style={StyleSheet.absoluteFill} dim="rgba(0,0,0,0.26)" />
                    <Text style={s.vibeLabel}>{vibe}</Text>
                  </Tap>
                ))}
              </View>
            </View>
            <View style={{ marginTop: 16, marginHorizontal: -16 }}>
              <ReelsGrid count={reelCount} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 13, paddingHorizontal: 16, paddingBottom: 10, backgroundColor: "#fff" },
  input: { flex: 1, height: 42, borderRadius: 10, backgroundColor: C.chip, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8 },
  inputText: { flex: 1, fontSize: 14, color: C.ink, paddingVertical: 0 },
  filterChip: { borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12 },
  recentHeading: { paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  recentRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  recentMain: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 12, minHeight: 60 },
  recentIcon: { width: 44, height: 44, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, alignItems: "center", justifyContent: "center" },
  recentRemove: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  suggestion: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 13, paddingHorizontal: 2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  museCard: { marginTop: 17, padding: 17, borderRadius: 14, flexDirection: "row", gap: 12 },
  vibeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  vibe: { width: "48.5%", height: 176, borderRadius: 9, overflow: "hidden" },
  vibeLabel: { position: "absolute", left: 12, bottom: 10, color: "#fff", fontWeight: "700", fontSize: 15 },
  section: { paddingTop: 14, paddingBottom: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  accountRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 64 },
  follow: { height: 32, paddingHorizontal: 14, borderRadius: 8, backgroundColor: C.blue, alignItems: "center", justifyContent: "center" },
  mediaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 2, borderRadius: 8, overflow: "hidden", marginBottom: 6 },
  reels: { flexDirection: "row", flexWrap: "wrap", gap: 2 },
  reelViews: { position: "absolute", left: 8, bottom: 7, flexDirection: "row", alignItems: "center", gap: 3 },
});
