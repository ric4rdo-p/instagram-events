import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "./Icon";
import { Chip, SectionHeading, Tap, TopBar } from "./common";
import { AiAnswer, EventCard, FriendPlansRow, MiniEvent, ResultRow } from "./eventParts";
import { C } from "./theme";
import { categories, feedEvents, searchEvents } from "./data";

export default function EventsScreen({ onOpen, onBack, onOpenStory, onCreate }) {
  const [filter, setFilter] = useState("For you");
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchEvents(query), [query]);
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        title="Events"
        onBack={onBack}
        showTitle
        right={
          <Tap style={s.hostCta} onPress={onCreate}>
            <Icon name="plus" size={16} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Host</Text>
          </Tap>
        }
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={s.searchForm}>
          <View style={s.search}>
            <Icon name="search" size={18} color={C.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search events, artists, or places"
              placeholderTextColor={C.muted}
              returnKeyType="search"
              style={s.searchInput}
              accessibilityLabel="Search events"
            />
            {query ? (
              <Tap onPress={() => setQuery("")} accessibilityLabel="Clear search" hitSlop={8}>
                <Icon name="close" size={16} color={C.muted} />
              </Tap>
            ) : (
              <Icon name="sparkles" size={17} color={C.muted} />
            )}
          </View>
          {query ? (
            <Tap onPress={() => setQuery("")}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: C.ink }}>Cancel</Text>
            </Tap>
          ) : null}
        </View>
        {query ? (
          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <AiAnswer count={results.length} />
            {results.map((event) => (
              <ResultRow key={event.id} event={event} onPress={() => onOpen(event.id)} />
            ))}
          </View>
        ) : (
          <>
            <FriendPlansRow onOpenStory={onOpenStory} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 4 }}>
              {categories.map((c) => (
                <Chip key={c} label={c} active={filter === c} onPress={() => setFilter(c)} />
              ))}
            </ScrollView>
            <SectionHeading title="Happening near you" sub="San Francisco • This week" action="See all" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingLeft: 16, paddingRight: 22, paddingBottom: 15 }}>
              {feedEvents.slice(0, 2).map((event) => (
                <MiniEvent key={event.id} event={event} onPress={() => onOpen(event.id)} />
              ))}
            </ScrollView>
            <View style={s.divider} />
            <View style={s.recommend}>
              <Icon name="sparkles" size={16} color={C.purple} />
              <Text style={{ color: C.muted, fontSize: 12, flex: 1 }}>Picked for you by Muse</Text>
              <Icon name="more" size={18} color={C.muted} />
            </View>
            {feedEvents.map((event) => (
              <EventCard key={event.id} event={event} onOpen={() => onOpen(event.id)} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  hostCta: { height: 34, paddingHorizontal: 12, borderRadius: 8, backgroundColor: C.blue, flexDirection: "row", alignItems: "center", gap: 5 },
  searchForm: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10, marginHorizontal: 16, marginBottom: 12 },
  search: { flex: 1, borderRadius: 10, backgroundColor: C.chip, height: 40, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 9 },
  searchInput: { flex: 1, fontSize: 14, color: C.ink, paddingVertical: 0 },
  divider: { height: 6, backgroundColor: "#f7f7f7", borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.hairline },
  recommend: { paddingTop: 14, paddingHorizontal: 16, paddingBottom: 5, flexDirection: "row", alignItems: "center", gap: 6 },
});
