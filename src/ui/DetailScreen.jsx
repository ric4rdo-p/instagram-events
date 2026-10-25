import { useCallback, useMemo, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import Icon from "./Icon";
import { ActionSheet, BottomModal, Grad, HostAvatar, MiniFaces, Photo, PlanAvatar, ProfilePic, Segmented, Switch, Tap } from "./common";
import { MiniEvent } from "./eventParts";
import { C } from "./theme";
import {
  DEMO_ORIGIN, ME, attendees, commentMood, dateLabel, detailsFor, domainOf, driveMinutes, eventEnd, eventStart, feedEvents,
  gradientOf, initialsOf, kmBetween, linksFor, museAnswer, photoList, rangeParts, reportReasons, similarReason, similarScore, venueFor,
} from "./data";

function AskMuse({ event }) {
  const [question, setQuestion] = useState("");
  const [thread, setThread] = useState([]);
  const chips = ["Can I go solo?", "What should I wear?", "Is parking easy?", "How much is it?"];
  const ask = (text) => {
    const q = text.trim();
    if (!q) return;
    setThread((t) => [...t, { q, a: museAnswer(q, event) }]);
    setQuestion("");
  };
  return (
    <View style={{ paddingTop: 2, paddingBottom: 22 }}>
      <View style={s.rowGap6}>
        <Icon name="sparkles" size={17} color={C.purple} />
        <Text style={s.h14}>Ask Muse</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }} style={{ marginTop: 10, marginBottom: 12 }}>
        {chips.map((c) => (
          <Tap key={c} onPress={() => ask(c)} style={s.askChip}>
            <Text style={{ fontSize: 12, color: C.ink }}>{c}</Text>
          </Tap>
        ))}
      </ScrollView>
      {thread.length > 0 ? (
        <View style={{ gap: 12, marginBottom: 12 }}>
          {thread.map((item, i) => (
            <View key={i} style={{ gap: 8 }}>
              <Text style={s.askQ}>{item.q}</Text>
              <View style={s.askA}>
                <Grad name="muse" style={s.askOrb}>
                  <Icon name="sparkles" size={14} color="#fff" />
                </Grad>
                <Text style={s.askABubble}>{item.a}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
      <View style={s.askInput}>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          onSubmitEditing={() => ask(question)}
          placeholder="Ask anything about this event…"
          placeholderTextColor={C.muted}
          returnKeyType="send"
          style={{ flex: 1, fontSize: 14, color: C.ink, paddingVertical: 0 }}
          accessibilityLabel="Ask Muse a question about this event"
        />
        <Tap onPress={() => ask(question)} disabled={!question.trim()} style={[s.askSend, !question.trim() && { backgroundColor: C.blueDisabled }]} accessibilityLabel="Send question">
          <Icon name="arrowUp" size={18} color="#fff" />
        </Tap>
      </View>
    </View>
  );
}

function PersonRow({ person }) {
  const [following, setFollowing] = useState(person.following);
  return (
    <View style={s.personRow}>
      <PlanAvatar gradient={person.gradient} initials={person.initials} size={40} fontSize={13} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>{person.user}</Text>
        <Text style={{ color: C.muted, fontSize: 12, marginTop: 1 }}>{person.note}</Text>
      </View>
      <Tap onPress={() => setFollowing(!following)} style={[s.followButton, following && { backgroundColor: C.chip }]}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: following ? C.ink : "#fff" }}>{following ? "Following" : "Follow"}</Text>
      </Tap>
    </View>
  );
}

function EventMap({ venue }) {
  const origin = DEMO_ORIGIN;
  const minutes = driveMinutes(kmBetween(origin, venue));
  const W = 360;
  const H = 170;
  const pad = 42;
  const cLat = (origin.lat + venue.lat) / 2;
  const cLng = (origin.lng + venue.lng) / 2;
  const k = Math.min((W - pad * 2) / Math.max(Math.abs(origin.lng - venue.lng), 0.006), (H - pad * 2) / Math.max(Math.abs(origin.lat - venue.lat), 0.004));
  const pt = (p) => ({ x: W / 2 + (p.lng - cLng) * k, y: H / 2 - (p.lat - cLat) * k });
  const a = pt(origin);
  const b = pt(venue);
  const isPark = /park/i.test(venue.name);
  const verticals = Array.from({ length: 13 }, (_, i) => i * 31 - 8);
  const horizontals = Array.from({ length: 7 }, (_, i) => i * 28 + 6);
  return (
    <View style={s.map}>
      <View style={{ height: 170, backgroundColor: "#f2efe9" }}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" accessibilityLabel={`Map of ${venue.name}. About ${minutes} minutes away by car.`}>
          <Rect width={W} height={H} fill="#f2efe9" />
          {isPark ? <Rect x={b.x - 50} y={b.y - 34} width="100" height="62" rx="10" fill="#cfe5c3" /> : null}
          {verticals.map((x) => <Line key={`v${x}`} x1={x} y1={0} x2={x + 10} y2={H} stroke="#ffffff" strokeWidth="5" />)}
          {horizontals.map((y) => <Line key={`h${y}`} x1={0} y1={y} x2={W} y2={y - 6} stroke="#ffffff" strokeWidth="5" />)}
          <Path d={`M0 ${H * 0.7} L${W} ${H * 0.52}`} stroke="#fbe3a1" strokeWidth="9" />
          <Path d={`M${a.x} ${a.y} L${b.x} ${a.y} L${b.x} ${b.y}`} fill="none" stroke="#0095f6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx={a.x} cy={a.y} r="11" fill="#0095f6" fillOpacity="0.18" />
          <Circle cx={a.x} cy={a.y} r="6" fill="#0095f6" stroke="#ffffff" strokeWidth="2.5" />
          <Path transform={`translate(${b.x - 13} ${b.y - 34})`} d="M13 0C5.8 0 0 5.6 0 12.6 0 22 13 34 13 34s13-12 13-21.4C26 5.6 20.2 0 13 0Z" fill="#ed4956" />
          <Circle cx={b.x} cy={b.y - 21} r="4.5" fill="#ffffff" />
        </Svg>
      </View>
      <View style={s.mapFoot}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>{venue.name}</Text>
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{venue.address}</Text>
          <View style={[s.rowGap6, { marginTop: 6, gap: 5 }]}>
            <Icon name="car" size={15} />
            <Text style={{ fontSize: 13, color: C.ink }}>
              <Text style={{ fontWeight: "700" }}>{minutes} min</Text> drive from you
            </Text>
          </View>
        </View>
        <Tap
          style={s.directions}
          onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}&travelmode=driving`)}
        >
          <Icon name="location" size={16} />
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>Directions</Text>
        </Tap>
      </View>
    </View>
  );
}

function CommentRow({ comment, top, onOpen }) {
  const [liked, setLiked] = useState(false);
  const likes = comment.likes + (liked ? 1 : 0);
  const body = (
    <>
      {top ? <Text style={s.topComment}>TOP COMMENT</Text> : null}
      <Text style={{ fontSize: 13, lineHeight: 18, color: C.ink }}>
        <Text style={{ fontWeight: "700" }}>{comment.user} </Text>
        {comment.isHost ? <Text style={s.hostBadge}> Host </Text> : null}
        {comment.isHost ? " " : ""}
        {comment.text}
      </Text>
      <Text style={{ color: C.muted, fontSize: 12 }}>
        {comment.ago}
        {likes > 0 ? ` • ${likes} ${likes === 1 ? "like" : "likes"}` : ""} • Reply
      </Text>
    </>
  );
  return (
    <View style={s.commentRow}>
      <PlanAvatar gradient={gradientOf(comment.user)} initials={initialsOf(comment.user)} size={32} fontSize={11} />
      {onOpen ? (
        <Tap style={s.commentBody} onPress={onOpen} accessibilityLabel={`Top comment by ${comment.user}. Show all comments`}>
          {body}
        </Tap>
      ) : (
        <View style={s.commentBody}>{body}</View>
      )}
      <Tap style={s.commentLike} onPress={() => setLiked(!liked)} accessibilityLabel={liked ? "Unlike comment" : "Like comment"}>
        <Icon name="heart" size={15} filled={liked} color={liked ? C.red : C.muted} />
      </Tap>
    </View>
  );
}

function CommentsSection({ comments, onAdd }) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const sorted = useMemo(() => [...comments].sort((a, b) => b.likes - a.likes), [comments]);
  const visible = expanded ? sorted : sorted.slice(0, 1);
  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onAdd(t);
    setText("");
    setExpanded(true);
  };
  return (
    <View style={s.block}>
      <View style={s.blockHeading}>
        <Text style={s.h15}>Comments</Text>
        <Text style={{ color: C.muted, fontSize: 13 }}>{comments.length}</Text>
      </View>
      {comments.length === 0 ? <Text style={s.emptyNote}>No comments yet. Start the conversation.</Text> : null}
      {expanded
        ? visible.map((c) => <CommentRow key={c.id} comment={c} />)
        : visible.length > 0 && <CommentRow comment={visible[0]} top onOpen={comments.length > 1 ? () => setExpanded(true) : undefined} />}
      {comments.length > 1 ? (
        <Tap style={s.viewAll} onPress={() => setExpanded(!expanded)}>
          <Text style={s.viewAllText}>{expanded ? "Show less" : `View all ${comments.length} comments`}</Text>
        </Tap>
      ) : null}
      <View style={s.composer}>
        <ProfilePic size={24} />
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={submit}
          placeholder="Add a comment…"
          placeholderTextColor={C.muted}
          maxLength={300}
          returnKeyType="send"
          style={{ flex: 1, fontSize: 14, height: 36, color: C.ink, paddingVertical: 0 }}
          accessibilityLabel="Add a comment"
        />
        <Tap onPress={submit} disabled={!text.trim()}>
          <Text style={{ color: text.trim() ? C.blueText : C.blueDisabled, fontSize: 14, fontWeight: "700" }}>Post</Text>
        </Tap>
      </View>
    </View>
  );
}

function ExperienceViewer({ item, event, onClose }) {
  const { width } = useWindowDimensions();
  return (
    <BottomModal onClose={onClose}>
      <ScrollView>
        <View style={s.sheetHeader}>
          <PlanAvatar gradient={gradientOf(item.user)} initials={initialsOf(item.user)} size={32} fontSize={11} />
          <Text style={{ flex: 1, fontSize: 14, fontWeight: "700", color: C.ink }}>{item.user}</Text>
          <Tap style={s.icon44} onPress={onClose} accessibilityLabel="Close">
            <Icon name="close" />
          </Tap>
        </View>
        <View style={{ backgroundColor: "#000" }}>
          <Photo uri={item.image} style={{ width, height: item.kind === "reel" ? (width * 14) / 9 * 0.8 : (width * 5) / 4 }} />
          {item.kind === "reel" ? (
            <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
              <Icon name="play" size={26} color="#fff" />
            </View>
          ) : null}
        </View>
        <Text style={{ marginTop: 12, marginHorizontal: 14, marginBottom: 8, fontSize: 14, lineHeight: 20, color: C.ink }}>
          <Text style={{ fontWeight: "700" }}>{item.user}</Text> {item.caption}
        </Text>
        <View style={s.tagChips}>
          {item.tagEvent ? (
            <View style={s.tagChip}>
              <Icon name="calendar" size={14} />
              <Text style={s.tagChipText}>{event.title}</Text>
            </View>
          ) : null}
          {item.tagHost ? (
            <View style={s.tagChip}>
              <Text style={s.tagChipText}>@{event.host}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </BottomModal>
  );
}

function ExperienceComposer({ event, onClose, onShare }) {
  const [kind, setKind] = useState("post");
  const [image, setImage] = useState(event.image);
  const [caption, setCaption] = useState("");
  const [tagEvent, setTagEvent] = useState(true);
  const [tagHost, setTagHost] = useState(true);
  const canShare = tagEvent || tagHost;
  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images", "videos"], quality: 0.8 });
    if (!result.canceled && result.assets?.[0]) setImage(result.assets[0].uri);
  };
  return (
    <BottomModal onClose={onClose}>
      <View style={s.sheetHeader}>
        <Tap style={s.icon44} onPress={onClose} accessibilityLabel="Close">
          <Icon name="close" />
        </Tap>
        <Text style={{ flex: 1, textAlign: "center", fontSize: 15, fontWeight: "700", color: C.ink }}>Share your experience</Text>
        <Tap
          disabled={!canShare}
          style={{ minHeight: 44, paddingHorizontal: 10, justifyContent: "center" }}
          onPress={() =>
            onShare({
              id: `x${Date.now()}`, kind, user: ME, image,
              caption: caption.trim() || (kind === "reel" ? "Had the best time" : "What a night"),
              tagHost, tagEvent, views: kind === "reel" ? "0" : undefined,
            })
          }
        >
          <Text style={{ color: canShare ? C.blueText : C.blueDisabled, fontWeight: "700", fontSize: 15 }}>Share</Text>
        </Tap>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Segmented
          wide
          style={{ marginTop: 14, marginHorizontal: 16, marginBottom: 12 }}
          options={[{ id: "post", label: "Post" }, { id: "reel", label: "Reel" }]}
          value={kind}
          onChange={setKind}
        />
        <View style={s.mediaPicker}>
          {photoList.map((src) => (
            <Tap key={src} style={[s.mediaTile, image === src && s.mediaSelected]} onPress={() => setImage(src)} accessibilityLabel="Use this photo">
              <Photo uri={src} style={StyleSheet.absoluteFill} />
            </Tap>
          ))}
          <Tap style={[s.mediaTile, s.uploadTile]} onPress={pick} accessibilityLabel="Upload from your device">
            {photoList.includes(image) ? <Icon name="plus" color={C.muted} /> : <Photo uri={image} style={StyleSheet.absoluteFill} />}
          </Tap>
        </View>
        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Write a caption…"
          placeholderTextColor={C.muted}
          maxLength={300}
          multiline
          style={s.captionInput}
          accessibilityLabel="Caption"
        />
        <View style={[s.toggleRow, { paddingHorizontal: 16 }]}>
          <View style={{ flex: 1 }}>
            <Text style={s.toggleTitle}>Tag the event</Text>
            <Text style={s.toggleSub}>{event.title}</Text>
          </View>
          <Switch checked={tagEvent} onChange={setTagEvent} />
        </View>
        <View style={[s.toggleRow, { paddingHorizontal: 16 }]}>
          <View style={{ flex: 1 }}>
            <Text style={s.toggleTitle}>Tag the host</Text>
            <Text style={s.toggleSub}>@{event.host}</Text>
          </View>
          <Switch checked={tagHost} onChange={setTagHost} />
        </View>
        <Text style={{ marginTop: 6, marginHorizontal: 16, fontSize: 12, color: C.muted }}>
          {canShare ? "Tagged posts and reels show up under Experiences on the event page." : "Tag the event or the host so it shows up on the event page."}
        </Text>
      </ScrollView>
    </BottomModal>
  );
}

function ExperiencesSection({ event, items, onAdd }) {
  const { width } = useWindowDimensions();
  const tile = (width - 34 - 6) / 3;
  const [viewing, setViewing] = useState(null);
  const [composing, setComposing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? items : items.slice(0, 3);
  const closeViewer = useCallback(() => setViewing(null), []);
  return (
    <View style={s.block}>
      <View style={s.blockHeading}>
        <Text style={s.h15}>Experiences</Text>
        <Text style={{ color: C.muted, fontSize: 13 }}>{items.length}</Text>
        <Tap style={s.shareExperience} onPress={() => setComposing(true)}>
          <Icon name="plus" size={16} />
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>Share yours</Text>
        </Tap>
      </View>
      <Text style={s.blockSub}>Posts and reels that tag this event or @{event.host}.</Text>
      {items.length === 0 ? (
        <Text style={s.emptyNote}>No experiences yet. Be the first to share one.</Text>
      ) : (
        <View style={s.expGrid}>
          {shown.map((item) => (
            <Tap key={item.id} style={{ width: tile, height: (tile * 4) / 3 }} onPress={() => setViewing(item)} accessibilityLabel={`${item.user}'s ${item.kind}: ${item.caption}`}>
              <Photo uri={item.image} style={StyleSheet.absoluteFill} />
              <LinearGradient colors={["transparent", "rgba(0,0,0,0.55)"]} locations={[0.55, 1]} style={StyleSheet.absoluteFill} />
              <View style={s.tileMeta}>
                {item.kind === "reel" ? (
                  <>
                    <Icon name="play" size={12} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{item.views}</Text>
                  </>
                ) : (
                  <Icon name="image" size={13} color="#fff" />
                )}
              </View>
              <Text style={s.tileUser} numberOfLines={1}>@{item.user}</Text>
            </Tap>
          ))}
        </View>
      )}
      {items.length > 3 ? (
        <Tap style={s.viewAll} onPress={() => setExpanded(!expanded)}>
          <Text style={s.viewAllText}>{expanded ? "Show less" : `View all ${items.length} posts and reels`}</Text>
        </Tap>
      ) : null}
      {viewing ? <ExperienceViewer item={viewing} event={event} onClose={closeViewer} /> : null}
      {composing ? (
        <ExperienceComposer
          event={event}
          onClose={() => setComposing(false)}
          onShare={(item) => {
            onAdd(item);
            setComposing(false);
          }}
        />
      ) : null}
    </View>
  );
}

function SimilarEvents({ event, onOpen }) {
  const picks = useMemo(
    () => feedEvents.filter((e) => e.id !== event.id).map((e) => ({ e, score: similarScore(event, e) })).sort((x, y) => y.score - x.score).slice(0, 4).map((x) => x.e),
    [event],
  );
  if (picks.length === 0) return null;
  return (
    <View style={[s.block, { paddingBottom: 10 }]}>
      <View style={s.blockHeading}>
        <Text style={s.h15}>Similar events</Text>
      </View>
      <View style={[s.rowGap6, { gap: 5, marginTop: -4, marginBottom: 10 }]}>
        <Icon name="sparkles" size={14} color={C.purple} />
        <Text style={{ fontSize: 12, color: C.muted }}>Picked by Muse based on this event and who’s going</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -17 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 17, paddingBottom: 6 }}>
        {picks.map((e) => (
          <MiniEvent key={e.id} event={e} height={120} onPress={() => onOpen(e.id)} reason={similarReason(event, e)} />
        ))}
      </ScrollView>
    </View>
  );
}

export default function DetailScreen({ event, comments, experiences, onAddComment, onAddExperience, onOpenEvent, onBack, onToast }) {
  const insets = useSafeAreaInsets();
  const [going, setGoing] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [sheet, setSheet] = useState(null);
  const [followingHost, setFollowingHost] = useState(false);
  const isMine = event.host === ME;
  const venue = venueFor(event);
  const details = detailsFor(event);
  const links = linksFor(event);
  const when = rangeParts(eventStart(event), eventEnd(event));
  const mood = useMemo(() => commentMood(comments), [comments]);
  const closeSheet = useCallback(() => setSheet(null), []);
  const copyLink = () => {
    Clipboard.setStringAsync(`https://www.instagram.com/events/${event.id}`).catch(() => undefined);
    onToast("Event link copied");
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ height: 425 + insets.top }}>
          <Photo uri={event.image} tint={event.imageTint} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={["rgba(0,0,0,0.4)", "transparent"]} locations={[0, 0.3]} style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.6)", "#fff"]}
            locations={[0.52, 0.76, 0.97]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[s.detailNav, { top: insets.top + 12 }]}>
            <Tap style={s.navCircle} onPress={onBack} accessibilityLabel="Back">
              <Icon name="back" color="#fff" />
            </Tap>
            <View style={{ flexDirection: "row", gap: 9 }}>
              <Tap style={s.navCircle} onPress={copyLink} accessibilityLabel="Copy event link">
                <Icon name="share" color="#fff" />
              </Tap>
              <Tap style={s.navCircle} onPress={() => setSheet("menu")} accessibilityLabel="Event options">
                <Icon name="more" color="#fff" />
              </Tap>
            </View>
          </View>
          <View style={s.overlay}>
            <Text style={s.overlayDate}>{dateLabel(event)}</Text>
            <Text style={s.overlayTitle}>{event.title}</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 17 }}>
          <View style={s.hostLine}>
            <HostAvatar gradient={event.gradient} label={event.avatar} size={36} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: C.ink }}>
                Hosted by <Text style={{ fontWeight: "700" }}>{event.host}</Text>
              </Text>
              <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{isMine ? "You" : "Community organizer"}</Text>
            </View>
            {isMine ? (
              <Tap>
                <Text style={{ color: C.blue, fontWeight: "700", fontSize: 13 }}>Edit</Text>
              </Tap>
            ) : (
              <Tap onPress={() => setFollowingHost(!followingHost)}>
                <Text style={{ color: followingHost ? C.ink : C.blue, fontWeight: "700", fontSize: 13 }}>{followingHost ? "Following" : "Follow"}</Text>
              </Tap>
            )}
          </View>
          <View style={s.stats}>
            {[
              ["clock", when.title, when.detail],
              ["location", venue.name, venue.address],
              ["ticket", event.price, event.price === "Free" ? "RSVP recommended" : "Pay at the door"],
            ].map(([icon, title, sub]) => (
              <View key={icon} style={s.statRow}>
                <Icon name={icon} color={C.sub} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>{title}</Text>
                  <Text style={{ color: C.muted, marginTop: 2, fontSize: 11 }}>{sub}</Text>
                </View>
              </View>
            ))}
          </View>
          <EventMap venue={venue} />
          <Tap style={s.friendsBlock} onPress={() => setShowPeople(!showPeople)}>
            <MiniFaces size={27} />
            <Text style={{ flex: 1, fontSize: 12, color: C.ink }}>{event.social}</Text>
            <View style={{ transform: [{ rotate: showPeople ? "180deg" : "0deg" }] }}>
              <Icon name="chevronDown" size={18} />
            </View>
          </Tap>
          {showPeople ? (
            <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline, paddingTop: 2, paddingBottom: 8 }}>
              {attendees.map((p) => (
                <PersonRow key={p.user} person={p} />
              ))}
            </View>
          ) : null}
          <View style={{ paddingTop: 17, paddingBottom: 5 }}>
            <Text style={s.h14}>About this event</Text>
            <Text style={s.about}>{event.about}</Text>
            {aboutOpen && details ? <Text style={[s.about, { marginTop: 8 }]}>{details}</Text> : null}
            {details ? (
              <Tap onPress={() => setAboutOpen(!aboutOpen)} style={{ paddingVertical: 4 }}>
                <Text style={{ fontSize: 13, color: C.muted }}>{aboutOpen ? "less" : "more"}</Text>
              </Tap>
            ) : null}
          </View>
          {links.length > 0 ? (
            <View style={{ paddingTop: 14, paddingBottom: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hairline }}>
              <Text style={s.h14}>Links</Text>
              {links.map((link, i) => (
                <Tap key={link.url} style={[s.linkRow, i === links.length - 1 && { borderBottomWidth: 0 }]} onPress={() => Linking.openURL(link.url)}>
                  <View style={s.linkIcon}>
                    <Icon name="link" size={18} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>{link.label}</Text>
                    <Text style={{ color: C.muted, fontSize: 12 }}>{domainOf(link.url)}</Text>
                  </View>
                  <Icon name="chevron" size={18} />
                </Tap>
              ))}
            </View>
          ) : null}
          <View style={s.communityNote}>
            <Icon name="users" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>Community fit</Text>
              <Text style={{ fontSize: 11, lineHeight: 15, color: C.muted, marginVertical: 4 }}>
                This event is public. The host uses Instagram’s safety filters and attendee approval for new accounts.
              </Text>
            </View>
          </View>
          <Grad colors={["#f6efff", "#fff5f7"]} style={s.museSummary}>
            <Icon name="sparkles" size={19} color={C.purple} />
            <View style={{ flex: 1, gap: 10, minWidth: 0 }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: "700", marginBottom: 3, color: C.ink }}>Muse summary</Text>
                <Text style={{ fontSize: 12, lineHeight: 17, color: C.ink }}>{event.summary}</Text>
              </View>
              {mood ? (
                <View style={s.mood}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: C.purpleDeep }}>
                    How people feel, from {mood.count} {mood.count === 1 ? "comment" : "comments"}
                  </Text>
                  <Text style={{ fontSize: 12, lineHeight: 17, color: "#333" }}>{mood.message}</Text>
                </View>
              ) : null}
            </View>
          </Grad>
          <AskMuse event={event} />
          <CommentsSection comments={comments} onAdd={onAddComment} />
          <ExperiencesSection
            event={event}
            items={experiences}
            onAdd={(item) => {
              onAddExperience(item);
              onToast("Shared. It’s now under Experiences.");
            }}
          />
          <SimilarEvents event={event} onOpen={onOpenEvent} />
        </View>
      </ScrollView>
      <View style={s.cta}>
        <Tap style={[s.ctaButton, { width: 105, backgroundColor: C.chip }]} onPress={() => onToast("Saved to your collection")}>
          <Icon name="bookmark" size={19} />
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>Save</Text>
        </Tap>
        <Tap style={[s.ctaButton, { flex: 1, backgroundColor: C.blue }]} onPress={() => setGoing(!going)}>
          {going ? <Icon name="check" size={18} color="#fff" /> : null}
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>{going ? "Going" : "I’m interested"}</Text>
        </Tap>
      </View>
      {/* One sheet whose contents switch, so iOS never has to swap two modals at once */}
      {sheet ? (
        <ActionSheet
          onClose={closeSheet}
          {...(sheet === "menu"
            ? {
                title: "Event options",
                options: [
                  { label: "Add to calendar", onSelect: () => onToast("Added to your calendar") },
                  { label: "Copy event link", onSelect: copyLink },
                  { label: "Find support or report event", onSelect: () => setSheet("report"), destructive: true, closes: false },
                ],
              }
            : {
                title: "Find support or report",
                description: "Reports are anonymous. If someone is in immediate danger, contact local emergency services.",
                options: reportReasons.map((reason) => ({ label: reason, onSelect: () => onToast("Thanks for letting us know. We’ll review this event.") })),
              })}
        />
      ) : null}
    </View>
  );
}

const textGlow = { textShadowColor: "rgba(255,255,255,0.95)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 };

const s = StyleSheet.create({
  rowGap6: { flexDirection: "row", alignItems: "center", gap: 6 },
  h14: { fontSize: 14, fontWeight: "700", color: C.ink },
  h15: { fontSize: 15, fontWeight: "700", color: C.ink },
  askChip: { borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 16, paddingVertical: 8, paddingHorizontal: 12 },
  askQ: {
    alignSelf: "flex-end", maxWidth: "80%", backgroundColor: C.chip, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 4,
    paddingVertical: 8, paddingHorizontal: 12, fontSize: 13, color: C.ink, overflow: "hidden",
  },
  askA: { alignSelf: "flex-start", maxWidth: "90%", flexDirection: "row", gap: 8 },
  askOrb: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  askABubble: {
    flexShrink: 1, backgroundColor: "#f7f4ff", borderTopLeftRadius: 4, borderTopRightRadius: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
    paddingVertical: 8, paddingHorizontal: 12, fontSize: 13, lineHeight: 19, color: C.ink, overflow: "hidden",
  },
  askInput: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 22, paddingLeft: 14, paddingRight: 6, height: 46 },
  askSend: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.blue, alignItems: "center", justifyContent: "center" },
  personRow: { flexDirection: "row", alignItems: "center", gap: 11, minHeight: 56 },
  followButton: { height: 32, paddingHorizontal: 14, borderRadius: 8, backgroundColor: C.blue, alignItems: "center", justifyContent: "center" },
  map: { marginTop: 6, marginBottom: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 12, overflow: "hidden" },
  mapFoot: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 11, paddingHorizontal: 12 },
  directions: { height: 36, paddingHorizontal: 12, borderRadius: 8, backgroundColor: C.chip, flexDirection: "row", alignItems: "center", gap: 6 },
  commentRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 8 },
  commentBody: { flex: 1, minWidth: 0, gap: 3 },
  topComment: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3, color: C.pink },
  hostBadge: { backgroundColor: C.chip, fontSize: 10, fontWeight: "700", color: C.ink },
  commentLike: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  block: { paddingTop: 16, paddingBottom: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hairline },
  blockHeading: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  blockSub: { marginTop: -4, marginBottom: 10, fontSize: 12, color: C.muted },
  emptyNote: { marginTop: 4, marginBottom: 10, fontSize: 13, color: C.muted },
  viewAll: { minHeight: 36, justifyContent: "center" },
  viewAllText: { color: C.muted, fontSize: 13, fontWeight: "600" },
  composer: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6, paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hairline },
  sheetHeader: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6, paddingRight: 6, paddingLeft: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  icon44: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  tagChips: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: 14, paddingBottom: 8 },
  tagChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 14, backgroundColor: C.chip },
  tagChipText: { fontSize: 12, fontWeight: "600", color: C.ink },
  mediaPicker: { flexDirection: "row", flexWrap: "wrap", gap: 4, paddingHorizontal: 16 },
  mediaTile: { width: "32%", aspectRatio: 1, borderRadius: 6, overflow: "hidden", backgroundColor: C.chip },
  mediaSelected: { borderWidth: 3, borderColor: C.blue },
  uploadTile: { alignItems: "center", justifyContent: "center", borderWidth: 1, borderStyle: "dashed", borderColor: "#c7c7c7" },
  captionInput: {
    marginTop: 12, marginHorizontal: 16, marginBottom: 4, height: 72, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, color: C.ink, textAlignVertical: "top",
  },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 58 },
  toggleTitle: { fontSize: 14, color: C.ink },
  toggleSub: { fontSize: 12, color: C.muted, marginTop: 2 },
  shareExperience: { marginLeft: "auto", height: 32, paddingHorizontal: 12, borderRadius: 8, backgroundColor: C.chip, flexDirection: "row", alignItems: "center", gap: 4 },
  expGrid: { flexDirection: "row", flexWrap: "wrap", gap: 3, borderRadius: 10, overflow: "hidden" },
  tileMeta: { position: "absolute", top: 6, right: 6, flexDirection: "row", alignItems: "center", gap: 2 },
  tileUser: { position: "absolute", left: 6, right: 6, bottom: 6, color: "#fff", fontSize: 11, fontWeight: "700" },
  detailNav: { position: "absolute", left: 14, right: 14, flexDirection: "row", justifyContent: "space-between" },
  navCircle: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.36)" },
  overlay: { position: "absolute", left: 17, right: 17, bottom: 2 },
  overlayDate: { fontSize: 11, fontWeight: "700", marginBottom: 6, color: C.pink, ...textGlow, textShadowRadius: 6 },
  overlayTitle: { fontSize: 30, lineHeight: 31, fontWeight: "700", letterSpacing: -0.7, color: C.ink, ...textGlow },
  hostLine: { flexDirection: "row", alignItems: "center", gap: 11, paddingTop: 12, paddingBottom: 17, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  stats: { paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  statRow: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 13 },
  friendsBlock: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline, gap: 11 },
  about: { fontSize: 14, lineHeight: 20, marginTop: 7, color: C.ink },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 58, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  linkIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.chip, alignItems: "center", justifyContent: "center" },
  communityNote: { flexDirection: "row", gap: 12, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hairline },
  museSummary: { flexDirection: "row", gap: 11, padding: 14, marginVertical: 14, borderRadius: 12 },
  mood: { paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(161,64,255,0.18)", gap: 2 },
  cta: {
    flexDirection: "row", gap: 9, paddingVertical: 11, paddingHorizontal: 15, backgroundColor: "rgba(255,255,255,0.96)", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border,
  },
  ctaButton: { height: 43, borderRadius: 9, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
});
