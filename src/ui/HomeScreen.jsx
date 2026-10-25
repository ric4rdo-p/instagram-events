import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "./Icon";
import { Grad, HostAvatar, MiniFaces, Photo, Tap, TopBar } from "./common";
import { C } from "./theme";
import { dateLabel, feedEvents, getEvent, gradientOf, initialsOf, photos, postSeeds } from "./data";

const stories = [
  ["Your story", photos.hero, true],
  ["maya.chen", photos.dance],
  ["jordanlee", photos.music],
  ["sf.weekender", photos.market],
  ["sophiakim", photos.festival],
];

function HomeStories() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.storiesWrap} contentContainerStyle={s.stories}>
      {stories.map(([name, image, own]) => (
        <Tap key={name} style={s.story}>
          {own ? (
            <View style={[s.ring, { backgroundColor: "#e5e5e5" }]}>
              <Image source={{ uri: image }} style={s.ringImage} contentFit="cover" />
              <View style={s.ownPlus}>
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700", lineHeight: 16 }}>+</Text>
              </View>
            </View>
          ) : (
            <Grad name="story" ring style={s.ring}>
              <Image source={{ uri: image }} style={s.ringImage} contentFit="cover" />
            </Grad>
          )}
          <Text style={{ fontSize: 11, color: C.ink }} numberOfLines={1}>{name}</Text>
        </Tap>
      ))}
    </ScrollView>
  );
}

function HomeEventsModule({ mode, onEvents, onOpenEvent, onMenu }) {
  if (mode === "hidden") return null;
  if (mode === "compact") {
    return (
      <View style={s.compact}>
        <Tap style={s.compactMain} onPress={onEvents}>
          <View style={s.compactIcon}>
            <Icon name="calendar" size={20} color={C.pink} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>3 events near you this week</Text>
            <Text style={{ fontSize: 11, color: C.muted }} numberOfLines={1}>Maya and Jordan are going to Golden Hour in the Park</Text>
          </View>
          <Icon name="chevron" size={18} />
        </Tap>
        <Tap style={s.compactMore} onPress={onMenu} accessibilityLabel="Events on Home options">
          <Icon name="more" size={20} />
        </Tap>
      </View>
    );
  }
  return (
    <View style={s.module}>
      <View style={s.moduleHeading}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
          <Icon name="calendar" size={18} color={C.pink} />
          <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>Happening near you</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Tap onPress={onEvents}>
            <Text style={{ color: C.blue, fontSize: 12, fontWeight: "700" }}>See all</Text>
          </Tap>
          <Tap style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }} onPress={onMenu} accessibilityLabel="Events on Home options">
            <Icon name="more" size={20} />
          </Tap>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9, paddingLeft: 16, paddingRight: 26 }}>
        {feedEvents.slice(0, 2).map((event) => (
          <Tap key={event.id} style={s.homeCard} onPress={() => onOpenEvent(event.id)}>
            <Photo uri={event.image} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.7)"]} style={StyleSheet.absoluteFill} />
            <View style={s.homeCardDate}>
              <Text style={{ fontSize: 17, lineHeight: 18, fontWeight: "700", color: C.ink }}>{event.day}</Text>
              <Text style={{ fontSize: 8, color: C.pink, fontWeight: "700" }}>{event.month}</Text>
            </View>
            <View style={s.homeCardCopy}>
              <Text style={{ fontSize: 8, color: "#ffbad9", fontWeight: "700" }}>{dateLabel(event)}</Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff", marginVertical: 2 }}>{event.title}</Text>
              <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.85)" }}>{event.place}</Text>
            </View>
          </Tap>
        ))}
      </ScrollView>
      <View style={{ marginTop: 9, marginHorizontal: 16, flexDirection: "row", alignItems: "center" }}>
        <MiniFaces />
        <Text style={{ color: C.muted, fontSize: 10 }}>Events your friends are interested in</Text>
      </View>
    </View>
  );
}

function FeedPost({ post }) {
  const { width } = useWindowDimensions();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <View style={s.post}>
      <View style={s.postHeader}>
        <HostAvatar gradient={gradientOf(post.user)} label={initialsOf(post.user)} size={30} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: C.ink }}>{post.user}</Text>
          <Text style={{ fontSize: 10, marginTop: 1, color: C.ink }}>{post.place}</Text>
        </View>
        <Icon name="more" />
      </View>
      <Photo uri={post.image} style={{ width, height: width }} />
      <View style={s.postActions}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <Tap onPress={() => setLiked(!liked)} accessibilityLabel={liked ? "Unlike" : "Like"} hitSlop={6}>
            <Icon name="heart" filled={liked} color={liked ? C.red : C.ink} />
          </Tap>
          <Icon name="comment" />
          <Icon name="share" />
        </View>
        <Tap onPress={() => setSaved(!saved)} accessibilityLabel={saved ? "Unsave" : "Save"} hitSlop={6}>
          <Icon name="bookmark" filled={saved} />
        </Tap>
      </View>
      <View style={{ paddingHorizontal: 14 }}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: C.ink }}>{post.likes}</Text>
        <Text style={{ fontSize: 12, marginVertical: 5, color: C.ink }}>
          <Text style={{ fontWeight: "700" }}>{post.user}</Text> {post.caption}
        </Text>
        <Text style={{ fontSize: 12, color: C.muted }}>View all {post.comments} comments</Text>
      </View>
    </View>
  );
}

// Sponsored event posts dropped into the feed, one after the first post and then every 6 posts
const adEvents = [getEvent(6), getEvent(2), getEvent(3)];
const AD_EVERY = 6;

function PromoAd({ event, onOpen }) {
  const { width } = useWindowDimensions();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const cta = event.price === "Free" ? "RSVP on Instagram" : `Get tickets • ${event.price}`;
  return (
    <View style={s.post}>
      <View style={s.postHeader}>
        <HostAvatar gradient={event.gradient} label={event.avatar} size={30} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: C.ink }}>{event.host}</Text>
          <Text style={{ fontSize: 10, marginTop: 1, color: C.ink }}>Sponsored</Text>
        </View>
        <Icon name="more" />
      </View>
      <Tap onPress={onOpen} accessibilityLabel={`Open ${event.title}`}>
        <Photo uri={event.image} style={{ width, height: width }} />
        <View style={s.adPill}>
          <Icon name="calendar" size={14} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>Event</Text>
        </View>
        <View style={s.adDate}>
          <Text style={{ color: C.pink, fontSize: 9, fontWeight: "700" }}>{event.weekday}</Text>
          <Text style={{ fontSize: 23, lineHeight: 25, fontWeight: "700", color: C.ink }}>{event.day}</Text>
          <Text style={{ fontSize: 9, color: C.muted }}>{event.month}</Text>
        </View>
      </Tap>
      <Tap style={s.adCta} onPress={onOpen}>
        <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>{cta}</Text>
        <Icon name="chevron" size={16} color="#fff" />
      </Tap>
      <View style={s.postActions}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <Tap onPress={() => setLiked(!liked)} accessibilityLabel={liked ? "Unlike" : "Like"} hitSlop={6}>
            <Icon name="heart" filled={liked} color={liked ? C.red : C.ink} />
          </Tap>
          <Icon name="comment" />
          <Icon name="share" />
        </View>
        <Tap onPress={() => setSaved(!saved)} accessibilityLabel={saved ? "Unsave" : "Save"} hitSlop={6}>
          <Icon name="bookmark" filled={saved} />
        </Tap>
      </View>
      <View style={{ paddingHorizontal: 14 }}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: C.ink }}>Liked by sofiakim and 1,128 others</Text>
        <Text style={{ fontSize: 12, marginVertical: 5, color: C.ink }}>
          <Text style={{ fontWeight: "700" }}>{event.host}</Text> {event.title} • {dateLabel(event)}. {event.about}
        </Text>
        <Tap onPress={onOpen}>
          <Text style={{ fontSize: 12, color: C.muted }}>{event.social} • See event</Text>
        </Tap>
      </View>
    </View>
  );
}

export default function HomeScreen({ eventsMode, onEvents, onOpenEvent, onEventsMenu, onCreate }) {
  const [count, setCount] = useState(2);
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        right={
          <>
            <Tap onPress={onEvents} accessibilityLabel="Events" hitSlop={6}>
              <Icon name="calendar" />
              <View style={s.eventDot} />
            </Tap>
            <Tap onPress={onCreate} accessibilityLabel="Create" hitSlop={6}>
              <Icon name="plus" />
            </Tap>
            <Tap accessibilityLabel="Notifications" hitSlop={6}>
              <Icon name="heart" />
            </Tap>
          </>
        }
      />
      <FlatList
        data={Array.from({ length: count }, (_, i) => i).flatMap((i) => [
          { key: `p${i}`, post: postSeeds[i % postSeeds.length] },
          ...(i % AD_EVERY === 0 ? [{ key: `ad${i}`, ad: adEvents[(i / AD_EVERY) % adEvents.length] }] : []),
        ])}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (item.ad ? <PromoAd event={item.ad} onOpen={() => onOpenEvent(item.ad.id)} /> : <FeedPost post={item.post} />)}
        ListHeaderComponent={
          <>
            <HomeStories />
            <HomeEventsModule mode={eventsMode} onEvents={onEvents} onOpenEvent={onOpenEvent} onMenu={onEventsMenu} />
          </>
        }
        onEndReached={() => setCount((c) => c + 3)}
        onEndReachedThreshold={1.5}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  storiesWrap: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline, flexGrow: 0 },
  stories: { gap: 10, paddingTop: 12, paddingHorizontal: 12, paddingBottom: 14 },
  story: { width: 66, alignItems: "center", gap: 6 },
  ring: { width: 62, height: 62, borderRadius: 31, padding: 3 },
  ringImage: { width: "100%", height: "100%", borderRadius: 31, borderWidth: 2, borderColor: "#fff" },
  ownPlus: {
    position: "absolute", right: 0, bottom: 0, width: 19, height: 19, borderRadius: 10, backgroundColor: C.blue, borderWidth: 2, borderColor: "#fff",
    alignItems: "center", justifyContent: "center",
  },
  eventDot: { position: "absolute", right: -2, top: -1, width: 7, height: 7, borderRadius: 4, backgroundColor: C.red, borderWidth: 1, borderColor: "#fff" },
  module: { paddingTop: 14, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
  moduleHeading: { paddingHorizontal: 16, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  homeCard: { width: 220, height: 148, borderRadius: 11, overflow: "hidden" },
  homeCardDate: {
    position: "absolute", top: 9, right: 9, width: 37, height: 42, borderRadius: 7, backgroundColor: "rgba(255,255,255,0.94)", alignItems: "center", justifyContent: "center",
  },
  homeCardCopy: { position: "absolute", left: 11, right: 8, bottom: 9 },
  compact: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 8, paddingRight: 8, paddingLeft: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
  compactMain: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 11, minHeight: 48 },
  compactIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff0f6", alignItems: "center", justifyContent: "center" },
  compactMore: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  post: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border, paddingBottom: 14 },
  postHeader: { height: 54, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14 },
  adPill: {
    position: "absolute", top: 14, left: 14, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "rgba(0,0,0,0.48)", borderRadius: 20,
    flexDirection: "row", alignItems: "center", gap: 5,
  },
  adDate: {
    position: "absolute", right: 14, bottom: 14, width: 54, height: 62, borderRadius: 9, backgroundColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center",
  },
  adCta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 11, paddingHorizontal: 14, backgroundColor: C.blue },
  postActions: { height: 45, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
