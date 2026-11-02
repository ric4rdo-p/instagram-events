import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Modal, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { VideoView, useVideoPlayer } from "expo-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Rect } from "react-native-svg";
import Icon from "./Icon";
import { Chip, MuseOrb, Photo, ProfilePic, Shimmer, Tap } from "./common";
import { StickerCard } from "./StoryViewer";
import { C } from "./theme";
import { ME, defaultCustomRelease, isCustomRelease, releaseOptions, releaseWhen } from "./data";
import { WhenRow } from "./pickers";
import { adVariations, promoImages, reelCaptions as museReelCaptions } from "../muse";

export const kitItems = {
  reel: { id: "reel", label: "Reel", tab: "reel" },
  flyer: { id: "flyer", label: "Flyer", tab: "flyer" },
  story: { id: "story", label: "Story", tab: "story" },
  adA: { id: "adA", label: "Ad A", tab: "ads" },
  adB: { id: "adB", label: "Ad B", tab: "ads" },
};

function useFakeGeneration(seed) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, [seed]);
  return loading;
}

function VideoFill({ uri }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />;
}

// Content the creator uploaded instead of Muse's version (photo or video)
function Uploaded({ media }) {
  return (
    <>
      {media.type === "video" ? <VideoFill key={media.uri} uri={media.uri} /> : <Photo uri={media.uri} style={StyleSheet.absoluteFill} />}
      <View style={s.uploadBadge}>
        <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>Your upload</Text>
      </View>
    </>
  );
}

function PseudoQr({ text, size = 44 }) {
  const cells = useMemo(() => {
    let h = 2166136261;
    for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return Array.from({ length: 21 * 21 }, (_, i) => {
      const x = i % 21;
      const y = Math.floor(i / 21);
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (finder) {
        const fx = x > 13 ? x - 14 : x;
        const fy = y > 13 ? y - 14 : y;
        return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5);
      }
      h = Math.imul(h ^ i, 2654435761);
      return (h >>> 28) % 2 === 0;
    });
  }, [text]);
  return (
    <Svg width={size} height={size} viewBox="0 0 21 21" shapeRendering="crispEdges">
      <Rect width="21" height="21" fill="#fff" />
      {cells.map((on, i) => (on ? <Rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" fill="#111" /> : null))}
    </Svg>
  );
}

// Slideshow standing in for the generated reel: each slide fades and settles in, with its caption
function ReelPreview({ images, captions, cycle, style: reelStyle, paused, loading, tint, onTogglePause }) {
  const [slide, setSlide] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (paused || loading) return;
    const t = setInterval(() => setSlide((n) => (n + 1) % images.length), (cycle * 1000) / 3);
    return () => clearInterval(t);
  }, [paused, loading, cycle, images.length]);
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [slide, fade]);
  const scale = fade.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] });
  const rise = fade.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  return (
    <View style={s.tall}>
      {loading ? (
        <Shimmer />
      ) : (
        <>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade, transform: [{ scale }] }]}>
            <Photo uri={images[slide]} tint={slide === 0 ? tint : undefined} style={StyleSheet.absoluteFill} />
          </Animated.View>
          <Animated.Text
            style={[s.reelCaption, reelStyle === "chill" && { fontWeight: "600", fontSize: 17 }, { opacity: fade, transform: [{ translateY: rise }] }]}
          >
            {captions[slide]}
          </Animated.Text>
        </>
      )}
      {reelStyle === "cinematic" ? (
        <>
          <View style={[s.letterbox, { top: 0 }]} />
          <View style={[s.letterbox, { bottom: 0 }]} />
        </>
      ) : null}
      <View style={s.reelAudio}>
        <Icon name="play" size={11} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>Suggested audio: Sunset Groove • Original</Text>
      </View>
      <Tap style={s.reelToggle} onPress={onTogglePause} accessibilityLabel={paused ? "Play preview" : "Pause preview"}>
        <Icon name={paused ? "play" : "pause"} size={18} color="#fff" />
      </Tap>
    </View>
  );
}

function ReleasePicker({ value, onChange, start }) {
  const [open, setOpen] = useState(null);
  const custom = isCustomRelease(value);
  return (
    <View style={s.release}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Icon name="clock" size={16} />
        <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>Release</Text>
        <Text style={{ flex: 1, textAlign: "right", fontSize: 12, color: C.muted }} numberOfLines={2}>{releaseWhen(value, start)}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {releaseOptions.map((o) => (
          <Chip key={o.id} label={o.label} active={value === o.id} onPress={() => onChange(o.id)} style={{ height: 30, paddingHorizontal: 11 }} />
        ))}
        <Chip label="Custom" active={custom} onPress={() => !custom && onChange(defaultCustomRelease(start))} style={{ height: 30, paddingHorizontal: 11 }} />
      </ScrollView>
      {custom ? (
        <WhenRow label="Post on" value={value.at} onChange={(at) => onChange({ at })} minDate={new Date()} open={open} onOpen={setOpen} />
      ) : null}
    </View>
  );
}

const flyerThemes = {
  bold: { bg: "#111", color: "#fff", title: { color: "#ffcf4a", fontSize: 24, fontWeight: "800", textTransform: "uppercase" } },
  minimal: { bg: "#fff", color: "#111", title: { fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontWeight: "400", fontSize: 24 } },
  retro: { bg: "#f6e7c8", color: "#4a2a12", title: { color: "#c2410c", fontSize: 24, fontWeight: "800" } },
};

const tabs = [
  { id: "reel", label: "Reel", icon: "film" },
  { id: "flyer", label: "Flyer", icon: "ticket" },
  { id: "story", label: "Story", icon: "plus" },
  { id: "ads", label: "Ads", icon: "megaphone" },
];

export default function PromoKit({ draft, initialTab, saved, releases, uploads, onSetRelease, onSetUpload, onToggleSave, onClose }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(initialTab);
  const [seed, setSeed] = useState(0);
  const loading = useFakeGeneration(seed + tab.length * 100);
  const [reelStyle, setReelStyle] = useState("energetic");
  const [paused, setPaused] = useState(false);
  const [flyerStyle, setFlyerStyle] = useState("bold");
  const title = draft.title || "Your event";
  const isSaved = (id) => saved.some((x) => x.id === id);
  const cycle = reelStyle === "energetic" ? 6 : reelStyle === "chill" ? 12 : 9;
  const reelImages = promoImages(draft, seed);
  const reelCaptions = museReelCaptions(draft);
  const adCopy = adVariations(draft);
  const venueLabel = draft.venueName || "Location to be announced";
  const flyer = flyerThemes[flyerStyle];

  const upload = async (id, allowVideo) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: allowVideo ? ["images", "videos"] : ["images"], quality: 0.8 });
    const asset = result.assets?.[0];
    if (result.canceled || !asset) return;
    onSetUpload(id, { uri: asset.uri, type: asset.type === "video" ? "video" : "image" });
  };

  const saveButton = (id) => (
    <Tap style={[s.save, isSaved(id) && { backgroundColor: C.chip }]} onPress={() => onToggleSave(kitItems[id])}>
      {isSaved(id) ? <Icon name="check" size={16} /> : null}
      <Text style={{ fontSize: 13, fontWeight: "700", color: isSaved(id) ? C.ink : "#fff" }}>{isSaved(id) ? "Saved to promo kit" : "Save to promo kit"}</Text>
    </Tap>
  );
  // Regenerate (or go back to Muse's version) + upload your own, then release timing and save
  const controls = (id, allowVideo = false, generateLabel = "Regenerate") => (
    <View style={{ gap: 12 }}>
      <View style={s.actions}>
        {uploads[id] ? (
          <Tap style={s.generate} onPress={() => onSetUpload(id, null)}>
            <Icon name="sparkles" size={16} color={C.purpleDeep} />
            <Text style={{ color: C.purpleDeep, fontSize: 13, fontWeight: "700" }}>Use Muse’s version</Text>
          </Tap>
        ) : (
          <Tap style={s.generate} onPress={() => setSeed(seed + 1)}>
            <Icon name="sparkles" size={16} color={C.purpleDeep} />
            <Text style={{ color: C.purpleDeep, fontSize: 13, fontWeight: "700" }}>{generateLabel}</Text>
          </Tap>
        )}
        <Tap style={s.uploadButton} onPress={() => upload(id, allowVideo)}>
          <Icon name="image" size={16} />
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>{uploads[id] ? "Replace upload" : "Upload your own"}</Text>
        </Tap>
      </View>
      <ReleasePicker value={releases[id]} onChange={(r) => onSetRelease(id, r)} start={draft.start} />
      {saveButton(id)}
    </View>
  );

  return (
    <Modal visible animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
        <View style={s.header}>
          <Tap style={s.icon44} onPress={onClose} accessibilityLabel="Close promo kit">
            <Icon name="close" />
          </Tap>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: C.ink }}>Promo Kit</Text>
            <Text style={{ fontSize: 11, color: C.muted }}>{saved.length} saved</Text>
          </View>
          <Tap style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 6 }} onPress={onClose}>
            <Text style={{ color: C.blueText, fontSize: 15, fontWeight: "700" }}>Done</Text>
          </Tap>
        </View>
        <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 10, paddingHorizontal: 12 }}>
            {tabs.map((t) => (
              <Tap key={t.id} style={[s.tab, tab === t.id && { backgroundColor: C.ink }]} onPress={() => setTab(t.id)}>
                <Icon name={t.icon} size={17} color={tab === t.id ? "#fff" : C.ink} />
                <Text style={{ fontSize: 13, fontWeight: "700", color: tab === t.id ? "#fff" : C.ink }}>{t.label}</Text>
              </Tap>
            ))}
          </ScrollView>
        </View>
        <ScrollView contentContainerStyle={[s.body, { paddingBottom: insets.bottom + 28 }]}>
          <View style={s.hint}>
            <MuseOrb size={26} iconSize={14} />
            <Text style={{ flex: 1, fontSize: 12, color: C.sub, lineHeight: 17 }}>
              Muse made these from your event details. Don’t like one? Upload your own. Nothing posts until its release time.
            </Text>
          </View>

          {tab === "reel" ? (
            <>
              {!uploads.reel ? (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {["energetic", "chill", "cinematic"].map((x) => (
                    <Chip key={x} label={x[0].toUpperCase() + x.slice(1)} active={reelStyle === x} onPress={() => setReelStyle(x)} />
                  ))}
                </View>
              ) : null}
              {uploads.reel ? (
                <View style={s.tall}>
                  <Uploaded media={uploads.reel} />
                </View>
              ) : (
                <ReelPreview
                  key={`${reelStyle}-${seed}`}
                  images={reelImages}
                  captions={reelCaptions}
                  cycle={cycle}
                  style={reelStyle}
                  paused={paused}
                  loading={loading}
                  tint={draft.coverTint}
                  onTogglePause={() => setPaused(!paused)}
                />
              )}
              {controls("reel", true)}
            </>
          ) : null}

          {tab === "flyer" ? (
            <>
              {!uploads.flyer ? (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {["bold", "minimal", "retro"].map((x) => (
                    <Chip key={x} label={x[0].toUpperCase() + x.slice(1)} active={flyerStyle === x} onPress={() => setFlyerStyle(x)} />
                  ))}
                </View>
              ) : null}
              <View style={[s.flyer, { backgroundColor: flyer.bg }]}>
                {uploads.flyer ? (
                  <Uploaded media={uploads.flyer} />
                ) : loading ? (
                  <Shimmer />
                ) : (
                  <>
                    <Photo
                      uri={draft.cover}
                      tint={draft.coverTint}
                      style={[{ height: "52%" }, flyerStyle === "retro" && { margin: 8, marginBottom: 0, borderTopLeftRadius: 14, borderTopRightRadius: 14 }]}
                    />
                    <View style={{ flex: 1, gap: 3, paddingTop: 12, paddingHorizontal: 14 }}>
                      <Text style={{ fontSize: 10, letterSpacing: 1, color: flyer.color }}>{ME.toUpperCase()} PRESENTS</Text>
                      <Text style={[{ fontSize: 22, lineHeight: 25, fontWeight: "700", color: flyer.color }, flyer.title]}>{title}</Text>
                      <Text style={{ fontSize: 11, color: flyer.color }}>{draft.range}</Text>
                      <Text style={{ fontSize: 11, color: flyer.color }}>{venueLabel} • {draft.price}</Text>
                    </View>
                    <View style={s.flyerFoot}>
                      <PseudoQr text={title + draft.range} />
                      <Text style={{ fontSize: 10, fontWeight: "700", lineHeight: 13, color: flyer.color }}>Scan to RSVP{"\n"}on Instagram</Text>
                    </View>
                  </>
                )}
              </View>
              {controls("flyer")}
            </>
          ) : null}

          {tab === "story" ? (
            <>
              <View style={s.tall}>
                {uploads.story ? (
                  <Uploaded media={uploads.story} />
                ) : loading ? (
                  <Shimmer />
                ) : (
                  <>
                    <Photo uri={draft.cover} tint={draft.coverTint} style={StyleSheet.absoluteFill} />
                    <LinearGradient
                      colors={["rgba(0,0,0,0.35)", "transparent", "transparent", "rgba(0,0,0,0.45)"]}
                      locations={[0, 0.25, 0.55, 1]}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={s.storyUser}>
                      <ProfilePic size={24} />
                      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{ME}</Text>
                    </View>
                    <View style={s.storySticker}>
                      <View style={s.stickerStatus}>
                        <Icon name="calendar" size={14} color="#fff" />
                        <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>You’re invited</Text>
                      </View>
                      <StickerCard
                        compact
                        event={{ title, place: venueLabel }}
                        day={draft.range.match(/\d+/)?.[0] ?? "•"}
                        month={draft.range.slice(5, 8).toUpperCase()}
                        topLine={draft.range}
                      />
                      <View style={s.storyRsvp}>
                        <Text style={{ color: C.ink, fontSize: 12, fontWeight: "800" }}>Tap to RSVP</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
              {controls("story", true)}
            </>
          ) : null}

          {tab === "ads" ? (
            <View style={{ gap: 18 }}>
              {adCopy.map((ad) => (
                <View key={ad.id} style={{ gap: 12 }}>
                  <View style={s.adCard}>
                    <View style={s.adHead}>
                      <ProfilePic size={24} />
                      <View>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>{ME}</Text>
                        <Text style={{ color: C.muted, fontSize: 11 }}>Sponsored • {kitItems[ad.id].label}</Text>
                      </View>
                    </View>
                    <View style={{ aspectRatio: 1.4 }}>
                      {uploads[ad.id] ? (
                        <Uploaded media={uploads[ad.id]} />
                      ) : loading ? (
                        <Shimmer />
                      ) : (
                        <Photo uri={draft.cover} tint={draft.coverTint} style={StyleSheet.absoluteFill} />
                      )}
                    </View>
                    <View style={s.adCta}>
                      <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>{ad.cta}</Text>
                      <Icon name="chevron" size={16} color="#fff" />
                    </View>
                    <Text style={{ padding: 12, paddingTop: 10, fontSize: 13, lineHeight: 19, color: C.ink }}>
                      <Text style={{ fontWeight: "700" }}>{ad.headline}</Text>
                      {"\n"}
                      {ad.body}
                    </Text>
                  </View>
                  {controls(ad.id, false, "Write new variation")}
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  header: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 6, paddingRight: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
  icon44: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  tab: { height: 36, paddingHorizontal: 12, borderRadius: 18, backgroundColor: C.chip, flexDirection: "row", alignItems: "center", gap: 6 },
  body: { paddingTop: 14, paddingHorizontal: 16, gap: 14 },
  hint: { flexDirection: "row", gap: 10, alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: C.lilac },
  actions: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  generate: {
    height: 38, paddingHorizontal: 14, borderRadius: 19, borderWidth: 1, borderColor: C.lilacBorder, backgroundColor: C.lilac, flexDirection: "row", alignItems: "center", gap: 6,
  },
  uploadButton: { height: 38, paddingHorizontal: 14, borderRadius: 19, backgroundColor: C.chip, flexDirection: "row", alignItems: "center", gap: 6 },
  release: { gap: 10, padding: 12, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  save: { height: 42, borderRadius: 9, backgroundColor: C.blue, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  uploadBadge: { position: "absolute", top: 10, left: 10, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.55)" },
  tall: { width: 240, aspectRatio: 9 / 16, alignSelf: "center", borderRadius: 14, overflow: "hidden", backgroundColor: "#111" },
  reelCaption: {
    position: "absolute", left: 14, right: 14, bottom: 56, color: "#fff", fontSize: 20, fontWeight: "800", lineHeight: 23,
    textShadowColor: "rgba(0,0,0,0.6)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10,
  },
  letterbox: { position: "absolute", left: 0, right: 0, height: "9%", backgroundColor: "#000" },
  reelAudio: { position: "absolute", left: 12, bottom: 16, flexDirection: "row", alignItems: "center", gap: 4 },
  reelToggle: { position: "absolute", top: 10, right: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" },
  flyer: {
    width: 290, aspectRatio: 4 / 5, alignSelf: "center", borderRadius: 6, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 6,
  },
  flyerFoot: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 8, paddingHorizontal: 14, paddingBottom: 12 },
  storyUser: { position: "absolute", top: 12, left: 12, flexDirection: "row", alignItems: "center", gap: 6 },
  storySticker: { position: "absolute", left: 12, right: 12, top: "44%", alignItems: "center", gap: 8 },
  stickerStatus: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.55)", paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20 },
  storyRsvp: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, backgroundColor: "#fff" },
  adCard: { borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 12, overflow: "hidden" },
  adHead: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 12 },
  adCta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 12, backgroundColor: C.blue },
});
