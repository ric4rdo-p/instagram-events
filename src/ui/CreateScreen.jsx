import { useMemo, useRef, useState } from "react";
import { Animated, LayoutAnimation, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "./Icon";
import { Grad, Photo, Segmented, Shimmer, Switch, Tap } from "./common";
import PromoKit from "./PromoKit";
import { WhenRow } from "./pickers";
import { C } from "./theme";
import {
  DEMO_ORIGIN, ME, audienceHelp, clock, defaultRelease, domainOf, formatRange, monthShort, nextSaturday, photoList, photos, releaseLabel, releaseWhen,
  venues, weekdayShort,
} from "./data";
import { coverLooks, suggestDescription, suggestTitle } from "../muse";

function MuseField({ label, value, onChange, placeholder, max, multiline = false, suggest, hint }) {
  const suggestion = useMemo(() => suggest(value), [suggest, value]);
  const [open, setOpen] = useState(false);
  const [dismissedFor, setDismissedFor] = useState(null);
  const show = suggestion !== null && dismissedFor !== value;
  return (
    <View style={s.field}>
      <Text style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#a8a8a8"
        maxLength={max}
        multiline={multiline}
        style={[s.fieldInput, multiline && { height: 72, textAlignVertical: "top" }]}
        accessibilityLabel={label}
      />
      <View style={s.fieldMeta}>
        <Text style={{ color: "#8a8a8a", fontSize: 10 }}>{value.length}/{max}</Text>
        {show ? (
          <Tap onPress={() => setOpen(!open)} hitSlop={8} accessibilityLabel={`Muse has a suggestion for ${label.toLowerCase()}`}>
            <Grad name="muse" style={s.museFix}>
              <Icon name="sparkles" size={14} color="#fff" />
            </Grad>
            <View style={s.museBadge}>
              <Text style={{ color: "#fff", fontSize: 9, fontWeight: "800" }}>1</Text>
            </View>
          </Tap>
        ) : null}
      </View>
      {show && open ? (
        <View style={s.popover}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="sparkles" size={15} color={C.purpleDeep} />
            <Text style={{ fontSize: 12, fontWeight: "700", color: C.purpleDeep }}>{hint}</Text>
          </View>
          <Text style={{ fontSize: 14, lineHeight: 20, color: C.ink }}>{suggestion}</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Tap
              style={[s.popButton, { backgroundColor: C.blue }]}
              onPress={() => {
                onChange(suggestion ?? value);
                setOpen(false);
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>Accept</Text>
            </Tap>
            <Tap
              style={s.popButton}
              onPress={() => {
                setDismissedFor(value);
                setOpen(false);
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>Dismiss</Text>
            </Tap>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function SettingRow({ icon, title, value, open, onToggle, children }) {
  return (
    <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hairline }}>
      <Tap style={s.settingRow} onPress={onToggle}>
        <View style={s.settingIcon}>
          <Icon name={icon} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>{title}</Text>
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{value}</Text>
        </View>
        <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
          <Icon name="chevronDown" size={20} color={C.muted} />
        </View>
      </Tap>
      {open ? <View style={s.settingEditor}>{children}</View> : null}
    </View>
  );
}

function Radio({ checked }) {
  return (
    <View style={[s.radio, checked && { borderColor: C.blue }]}>
      {checked ? <View style={s.radioDot} /> : null}
    </View>
  );
}

function Checkbox({ checked }) {
  return (
    <View style={[s.checkbox, checked && { backgroundColor: C.blue, borderColor: C.blue }]}>
      {checked ? <Icon name="check" size={14} color="#fff" bold /> : null}
    </View>
  );
}

const editorInput = {
  height: 44, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, fontSize: 15, color: C.ink, backgroundColor: "#fafafa",
};

export default function CreateScreen({ onClose, onPublish }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [generated, setGenerated] = useState(false);
  const [cover, setCover] = useState(photos.festival);
  const [coverTint, setCoverTint] = useState(undefined);
  const [coverChosen, setCoverChosen] = useState(false);
  const [start, setStart] = useState(() => nextSaturday(16));
  const [end, setEnd] = useState(() => nextSaturday(19));
  const [venue, setVenue] = useState(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [ticket, setTicket] = useState("free");
  const [price, setPrice] = useState("10");
  const [links, setLinks] = useState([]);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [audience, setAudience] = useState("Public");
  const [approveRsvps, setApproveRsvps] = useState(false);
  const [safetyFilters, setSafetyFilters] = useState(true);
  const [shareInstagram, setShareInstagram] = useState(true);
  const [shareFacebook, setShareFacebook] = useState(true);
  const [openRow, setOpenRow] = useState(null);
  const [openPicker, setOpenPicker] = useState(null);
  const [coverGen, setCoverGen] = useState(0);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [kitOpen, setKitOpen] = useState(false);
  const [studioTab, setStudioTab] = useState(null);
  const [promo, setPromo] = useState([]);
  const [releases, setReleases] = useState(defaultRelease);
  const [uploads, setUploads] = useState({});
  const progress = useRef(new Animated.Value(1)).current;

  const toggle = (key) => setOpenRow((current) => (current === key ? null : key));
  const rangeLabel = formatRange(start, end);
  const timesValid = end > start;
  const priceValid = ticket === "free" || Number(price) > 0;
  const priceLabel = ticket === "free" ? "Free" : `$${Number(price) || 0}`;
  const audienceLabel = [audience, approveRsvps ? "Approval on" : "", safetyFilters ? "Safety filters on" : ""].filter(Boolean).join(" • ");
  const placeMatches = venues.filter((v) => `${v.name} ${v.address}`.toLowerCase().includes(placeQuery.trim().toLowerCase()));
  const exactPlace = venues.some((v) => v.name.toLowerCase() === placeQuery.trim().toLowerCase());
  const canContinue = step === 1 ? title.trim().length > 2 : step === 2 ? Boolean(venue && timesValid && priceValid) : true;
  const missing = step === 1 ? "Add an event name to continue" : !timesValid ? "The event has to end after it starts" : !venue ? "Add a location to continue" : !priceValid ? "Enter a ticket price" : "";
  const draft = { title: title.trim(), description, range: rangeLabel, venueName: venue?.name ?? "", price: priceLabel, cover, coverTint, start };

  const goTo = (next) => {
    setStep(next);
    Animated.timing(progress, { toValue: next, duration: 250, useNativeDriver: false }).start();
  };
  const changeStart = (value) => {
    setStart(value);
    if (end <= value) setEnd(new Date(value.getTime() + 3 * 60 * 60 * 1000));
  };
  const addLink = () => {
    let url = linkUrl.trim();
    if (!url) {
      setLinkError("Paste a link first");
      return;
    }
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    if (!/^https?:\/\/[^\s/?#]+\.[^\s/?#]+/i.test(url)) {
      setLinkError("That doesn’t look like a valid link");
      return;
    }
    setLinks((list) => [...list, { label: linkLabel.trim() || domainOf(url), url }]);
    setLinkLabel("");
    setLinkUrl("");
    setLinkError("");
  };
  const toggleSave = (item) => setPromo((list) => (list.some((p) => p.id === item.id) ? list.filter((p) => p.id !== item.id) : [...list, item]));
  // Muse swaps in a fresh cover right where the old one was
  const generateCover = () => {
    if (generatingCover) return;
    setGeneratingCover(true);
    setTimeout(() => {
      const n = coverGen + 1;
      setCover(photoList[n % photoList.length]);
      setCoverTint(coverLooks[n % coverLooks.length].tint);
      setCoverGen(n);
      setCoverChosen(true);
      setGeneratingCover(false);
    }, 1100);
  };
  const toggleKit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setKitOpen(!kitOpen);
  };
  const pickCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (result.canceled || !result.assets?.[0]) return;
    setCover(result.assets[0].uri);
    setCoverTint(undefined);
    setCoverChosen(true);
  };

  const publish = () => {
    const firstSentence = description.trim().match(/^[^.!?]*[.!?]?/)?.[0] ?? "";
    onPublish(
      {
        id: Date.now(),
        image: cover,
        imageTint: coverTint,
        weekday: weekdayShort(start).toUpperCase(),
        month: monthShort(start).toUpperCase(),
        day: String(start.getDate()),
        time: clock(start),
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        title: title.trim() || "Untitled event",
        place: venue ? venue.name : "Location to be announced",
        social: "Be the first to RSVP",
        reason: "Hosted by you",
        host: ME,
        avatar: "A",
        gradient: "sunset",
        price: priceLabel,
        about: description.trim() || "Details coming soon.",
        summary: `${audience === "Public" ? "Open to everyone" : `For ${audience.toLowerCase()}`}. ${ticket === "free" ? "Free to attend." : `Tickets are ${priceLabel}.`} ${firstSentence}`.trim(),
        venue: venue ?? undefined,
        links,
      },
      promo,
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={s.header}>
        <Tap style={s.icon44} onPress={onClose} accessibilityLabel="Close and discard">
          <Icon name="close" />
        </Tap>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: C.ink }}>{step === 3 ? "Review event" : "Create event"}</Text>
          <Text style={{ fontSize: 11, color: C.muted }}>Step {step} of 3</Text>
        </View>
        {step < 3 ? (
          <Tap style={{ minHeight: 44, minWidth: 44, alignItems: "flex-end", justifyContent: "center" }} onPress={() => canContinue && goTo(step + 1)}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: canContinue ? C.blue : "#b5b5b5" }}>Next</Text>
          </Tap>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>
      <View style={{ height: 2, backgroundColor: C.hairline }}>
        <Animated.View style={{ height: "100%", backgroundColor: C.blue, width: progress.interpolate({ inputRange: [0, 3], outputRange: ["0%", "100%"] }) }} />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {step === 1 ? (
          <View style={s.step}>
            <View style={s.cover}>
              <Photo uri={cover} tint={coverTint} dim={coverChosen ? undefined : "rgba(0,0,0,0.32)"} style={StyleSheet.absoluteFill} />
              {generatingCover ? <Shimmer /> : null}
              {!coverChosen && !generatingCover ? (
                <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
                  <View style={s.coverIcon}>
                    <Icon name="image" color="#fff" />
                  </View>
                  <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700", marginTop: 7, marginBottom: 2 }}>Add cover photo or Reel</Text>
                  <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}>Recommended 4:5</Text>
                </View>
              ) : null}
              <View style={s.coverActions}>
                <Tap onPress={generateCover} disabled={generatingCover}>
                  <Grad name="muse" style={s.coverAi}>
                    <Icon name="sparkles" size={14} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{generatingCover ? "Generating…" : coverChosen && coverGen > 0 ? "Generate another" : "Generate with Muse"}</Text>
                  </Grad>
                </Tap>
                <Tap style={s.coverUpload} onPress={pickCover}>
                  <Text style={{ color: C.ink, fontSize: 12, fontWeight: "700" }}>{coverChosen ? "Change" : "Upload"}</Text>
                </Tap>
              </View>
            </View>
            <MuseField label="Event name" value={title} onChange={setTitle} placeholder="Give your event a name" max={60} suggest={suggestTitle} hint="Make your title clearer" />
            <MuseField
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Tell people what to expect"
              max={500}
              multiline
              suggest={suggestDescription}
              hint="Make your description clearer"
            />
            <Tap
              onPress={() => {
                setGenerated(true);
                setTitle("Golden Hour Community Picnic");
                setDescription("Meet us on the lawn for live music, picnic blankets, and golden hour with your neighbors. Come solo or bring a friend. Everyone is welcome.");
              }}
            >
              <Grad colors={["#f5efff", "#fff2f6"]} style={s.museGenerate}>
                <Grad name="muse" style={s.museGenerateOrb}>
                  <Icon name="sparkles" color="#fff" />
                </Grad>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>{generated ? "Created with Muse" : "Create details with Muse"}</Text>
                  <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{generated ? "You can edit anything above" : "Turn a few words into a title and description"}</Text>
                </View>
                <Icon name={generated ? "check" : "chevron"} size={19} />
              </Grad>
            </Tap>
          </View>
        ) : null}

        {step === 2 ? (
          <View style={s.step}>
            <View style={s.intro}>
              <Grad name="hostIntro" style={s.introIcon}>
                <Icon name="calendar" color="#fff" />
              </Grad>
              <Text style={{ marginTop: 10, fontWeight: "700", fontSize: 15, color: C.ink }}>Add the details</Text>
              <Text style={{ fontSize: 12, color: C.muted, marginTop: 5, textAlign: "center" }}>People are more likely to join events with clear information.</Text>
            </View>

            <SettingRow icon="clock" title="Date and time" value={rangeLabel} open={openRow === "date"} onToggle={() => toggle("date")}>
              <WhenRow
                label="Starts"
                value={start}
                onChange={changeStart}
                minDate={new Date()}
                open={openPicker?.startsWith("start") ? openPicker.slice(6) : null}
                onOpen={(f) => setOpenPicker(f && `start-${f}`)}
              />
              <WhenRow
                label="Ends"
                value={end}
                onChange={setEnd}
                minDate={start}
                open={openPicker?.startsWith("end") ? openPicker.slice(4) : null}
                onOpen={(f) => setOpenPicker(f && `end-${f}`)}
              />
              {!timesValid ? <Text style={s.error}>The end has to be after the start.</Text> : null}
            </SettingRow>

            <SettingRow icon="location" title="Location" value={venue ? venue.name : "Add a location"} open={openRow === "location"} onToggle={() => toggle("location")}>
              <TextInput value={placeQuery} placeholder="Search places" placeholderTextColor={C.muted} onChangeText={setPlaceQuery} style={editorInput} accessibilityLabel="Search places" />
              <View>
                {placeMatches.map((v) => (
                  <Tap
                    key={v.name}
                    style={s.placeRow}
                    onPress={() => {
                      setVenue(v);
                      setPlaceQuery("");
                      setOpenRow(null);
                    }}
                  >
                    <Icon name="location" size={18} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>{v.name}</Text>
                      <Text style={{ fontSize: 12, color: C.muted }}>{v.address}</Text>
                    </View>
                    {venue?.name === v.name ? <Icon name="check" size={18} /> : null}
                  </Tap>
                ))}
                {placeQuery.trim() && !exactPlace ? (
                  <Tap
                    style={s.placeRow}
                    onPress={() => {
                      setVenue({ name: placeQuery.trim(), address: "San Francisco, CA", lat: DEMO_ORIGIN.lat + 0.006, lng: DEMO_ORIGIN.lng - 0.004 });
                      setPlaceQuery("");
                      setOpenRow(null);
                    }}
                  >
                    <Icon name="plus" size={18} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>Use “{placeQuery.trim()}”</Text>
                      <Text style={{ fontSize: 12, color: C.muted }}>Custom location</Text>
                    </View>
                  </Tap>
                ) : null}
              </View>
            </SettingRow>

            <SettingRow icon="ticket" title="Tickets" value={ticket === "free" ? "Free" : `$${price || "0"} per person`} open={openRow === "tickets"} onToggle={() => toggle("tickets")}>
              <Segmented wide options={[{ id: "free", label: "Free" }, { id: "paid", label: "Paid" }]} value={ticket} onChange={setTicket} />
              {ticket === "paid" ? (
                <View style={{ gap: 5 }}>
                  <Text style={{ fontSize: 12, color: C.muted }}>Price per person</Text>
                  <View style={[editorInput, { flexDirection: "row", alignItems: "center" }]}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: C.ink }}>$</Text>
                    <TextInput value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={{ flex: 1, fontSize: 15, color: C.ink, paddingLeft: 4, paddingVertical: 0 }} />
                  </View>
                </View>
              ) : null}
            </SettingRow>

            <SettingRow
              icon="link"
              title="Links"
              value={links.length ? `${links.length} ${links.length === 1 ? "link" : "links"}` : "Tickets, sign-ups, playlists…"}
              open={openRow === "links"}
              onToggle={() => toggle("links")}
            >
              {links.map((link, i) => (
                <View key={`${link.url}-${i}`} style={s.linkItem}>
                  <Icon name="link" size={16} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>{link.label}</Text>
                    <Text style={{ fontSize: 12, color: C.muted }}>{domainOf(link.url)}</Text>
                  </View>
                  <Tap style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }} onPress={() => setLinks((list) => list.filter((_, j) => j !== i))} accessibilityLabel={`Remove ${link.label}`}>
                    <Icon name="close" size={16} color={C.muted} />
                  </Tap>
                </View>
              ))}
              {links.length < 5 ? (
                <View style={{ gap: 10 }}>
                  <View style={{ gap: 5 }}>
                    <Text style={{ fontSize: 12, color: C.muted }}>Label (optional)</Text>
                    <TextInput value={linkLabel} onChangeText={setLinkLabel} placeholder="e.g. Ticket page" placeholderTextColor="#a8a8a8" maxLength={40} style={editorInput} />
                  </View>
                  <View style={{ gap: 5 }}>
                    <Text style={{ fontSize: 12, color: C.muted }}>Link</Text>
                    <TextInput
                      value={linkUrl}
                      onChangeText={(v) => {
                        setLinkUrl(v);
                        setLinkError("");
                      }}
                      onSubmitEditing={addLink}
                      placeholder="https://"
                      placeholderTextColor="#a8a8a8"
                      keyboardType="url"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={editorInput}
                    />
                  </View>
                  {linkError ? <Text style={s.error}>{linkError}</Text> : null}
                  <Tap style={s.addLink} onPress={addLink}>
                    <Icon name="plus" size={16} />
                    <Text style={{ fontSize: 13, fontWeight: "700", color: C.ink }}>Add link</Text>
                  </Tap>
                </View>
              ) : (
                <Text style={s.hint}>You can add up to 5 links.</Text>
              )}
            </SettingRow>

            <SettingRow icon="users" title="Audience" value={audienceLabel} open={openRow === "audience"} onToggle={() => toggle("audience")}>
              <View>
                {["Public", "Followers only", "Verified students"].map((a) => (
                  <Tap key={a} style={s.radioRow} onPress={() => setAudience(a)}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: C.ink }}>{a}</Text>
                      <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{audienceHelp[a]}</Text>
                    </View>
                    <Radio checked={audience === a} />
                  </Tap>
                ))}
              </View>
              <View style={s.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: C.ink }}>Approve RSVPs</Text>
                  <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Review requests before people can join</Text>
                </View>
                <Switch checked={approveRsvps} onChange={setApproveRsvps} />
              </View>
              <View style={s.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: C.ink }}>Safety filters</Text>
                  <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Keep spam and flagged accounts out</Text>
                </View>
                <Switch checked={safetyFilters} onChange={setSafetyFilters} />
              </View>
            </SettingRow>

            <View style={s.audienceNote}>
              <Icon name="sparkles" size={18} color={C.purpleMid} />
              <Text style={{ flex: 1, color: C.sub, fontSize: 11, lineHeight: 16 }}>
                <Text style={{ fontWeight: "700", color: C.ink }}>Muse audience match{"\n"}</Text>
                {audience === "Public"
                  ? "Your event will be recommended to local people who engage with community, music, and outdoor events, not just your followers."
                  : `Muse will only recommend it to ${audience.toLowerCase()}${venue ? ` near ${venue.name}` : ""} who engage with events like yours.`}
              </Text>
            </View>
            {!canContinue ? <Text style={s.hint}>{missing}</Text> : null}
          </View>
        ) : null}

        {step === 3 ? (
          <View style={s.step}>
            <View style={s.reviewCard}>
              <Photo uri={cover} tint={coverTint} style={{ height: 210 }} />
              <View style={{ padding: 13 }}>
                <Text style={{ color: C.pink, fontSize: 10, fontWeight: "700" }}>{rangeLabel.toUpperCase()}</Text>
                <Text style={{ fontSize: 17, fontWeight: "700", marginVertical: 4, color: C.ink }}>{title || "Untitled event"}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                  <Icon name="location" size={13} color={C.muted} />
                  <Text style={{ color: C.muted, fontSize: 12 }}>{venue ? venue.name : "Location to be announced"}</Text>
                </View>
                {links.length > 0 ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 }}>
                    <Icon name="link" size={13} color={C.muted} />
                    <Text style={{ color: C.muted, fontSize: 12 }}>{links.length} {links.length === 1 ? "link" : "links"}</Text>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={{ paddingTop: 19, paddingBottom: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>Share to</Text>
              <Tap style={s.shareRow} onPress={() => setShareInstagram(!shareInstagram)}>
                <Grad name="brandInstagram" ring style={s.brandDot}>
                  <Text style={s.brandText}>◎</Text>
                </Grad>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: C.ink }}>Instagram</Text>
                  <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Events, Explore, and your profile</Text>
                </View>
                <Checkbox checked={shareInstagram} />
              </Tap>
              <Tap style={s.shareRow} onPress={() => setShareFacebook(!shareFacebook)}>
                <View style={[s.brandDot, { backgroundColor: "#1877f2" }]}>
                  <Text style={s.brandText}>f</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: C.ink }}>Facebook Events</Text>
                  <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Reach your connected community</Text>
                </View>
                <Checkbox checked={shareFacebook} />
              </Tap>
            </View>
            <Tap onPress={toggleKit}>
              <Grad colors={["#f5efff", "#fff2f6"]} style={s.kitButton}>
                <Grad name="muse" style={s.kitOrb}>
                  <Icon name="sparkles" size={20} color="#fff" />
                </Grad>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>Promo kit</Text>
                  <Text style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 16 }}>Reels, flyers, Stories, and ads made by Muse, or upload your own</Text>
                </View>
                <View style={{ transform: [{ rotate: kitOpen ? "180deg" : "0deg" }] }}>
                  <Icon name="chevronDown" size={20} />
                </View>
              </Grad>
            </Tap>
            {kitOpen ? (
              <View style={s.promoShortcuts}>
                {[
                  ["reel", "film", "Reels"],
                  ["flyer", "ticket", "Flyers"],
                  ["story", "plus", "Stories"],
                  ["ads", "megaphone", "Ads"],
                ].map(([id, icon, label]) => (
                  <Tap key={id} style={s.promoButton} onPress={() => setStudioTab(id)}>
                    <Icon name={icon} size={18} color={C.purpleDeep} />
                    <Text style={{ fontSize: 12, fontWeight: "700", color: C.purpleDeep }}>{label}</Text>
                  </Tap>
                ))}
              </View>
            ) : null}
            <View style={s.savedSection}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Icon name="bookmark" size={17} />
                <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>Saved</Text>
                <Text style={{ fontSize: 13, color: C.muted }}>{promo.length}</Text>
              </View>
              {promo.length === 0 ? (
                <Text style={{ fontSize: 12, color: C.muted, lineHeight: 17, paddingVertical: 6 }}>
                  Nothing saved yet. Open the promo kit and save the pieces you want to post with your event.
                </Text>
              ) : (
                promo.map((item) => {
                  const media = uploads[item.id];
                  return (
                    <View key={item.id} style={s.savedRow}>
                      <Tap style={s.savedMain} onPress={() => setStudioTab(item.tab)}>
                        {media?.type === "video" ? (
                          <View style={[s.savedThumb, { backgroundColor: "#111", alignItems: "center", justifyContent: "center" }]}>
                            <Icon name="play" size={16} color="#fff" />
                          </View>
                        ) : (
                          <Photo uri={media?.uri ?? cover} tint={media ? undefined : coverTint} style={s.savedThumb} />
                        )}
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={{ fontSize: 14, fontWeight: "700", color: C.ink }}>
                            {item.label} <Text style={{ fontSize: 12, fontWeight: "400", color: C.muted }}>• {media ? "Your upload" : "Made by Muse"}</Text>
                          </Text>
                          <Text style={{ fontSize: 12, color: C.ink, marginTop: 2 }}>{releaseLabel(releases[item.id])}</Text>
                          <Text style={{ fontSize: 11, color: C.muted, marginTop: 1 }} numberOfLines={1}>{releaseWhen(releases[item.id], start)}</Text>
                        </View>
                      </Tap>
                      <Tap style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }} onPress={() => toggleSave(item)} accessibilityLabel={`Remove ${item.label} from promo kit`}>
                        <Icon name="close" size={16} color={C.muted} />
                      </Tap>
                    </View>
                  );
                })
              )}
            </View>
            <Tap style={[s.publish, !shareInstagram && !shareFacebook && { backgroundColor: C.blueDisabled }]} disabled={!shareInstagram && !shareFacebook} onPress={publish}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Publish event</Text>
            </Tap>
            <Text style={{ textAlign: "center", fontSize: 10, color: C.muted, marginTop: 10 }}>
              {!shareInstagram && !shareFacebook ? "Choose at least one place to share your event." : "You can edit event details or manage attendees anytime."}
            </Text>
          </View>
        ) : null}
        {step > 1 ? (
          <Tap style={s.back} onPress={() => goTo(step - 1)}>
            <Icon name="back" size={18} color={C.muted} />
            <Text style={{ color: C.muted, fontSize: 14, fontWeight: "600" }}>Back</Text>
          </Tap>
        ) : null}
      </ScrollView>
      {studioTab ? (
        <PromoKit
          draft={draft}
          initialTab={studioTab}
          saved={promo}
          releases={releases}
          uploads={uploads}
          onSetRelease={(id, release) => setReleases((r) => ({ ...r, [id]: release }))}
          onSetUpload={(id, media) => setUploads((u) => ({ ...u, [id]: media }))}
          onToggleSave={toggleSave}
          onClose={() => setStudioTab(null)}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  header: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 6, paddingRight: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
  icon44: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  step: { padding: 18 },
  cover: { height: 170, borderRadius: 12, overflow: "hidden" },
  coverIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.35)" },
  coverActions: { position: "absolute", right: 10, bottom: 10, flexDirection: "row", gap: 6 },
  coverAi: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 7, paddingVertical: 8, paddingHorizontal: 12 },
  coverUpload: { backgroundColor: "#fff", borderRadius: 7, paddingVertical: 8, paddingHorizontal: 12, justifyContent: "center" },
  field: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border, paddingTop: 17, paddingBottom: 12 },
  fieldInput: { fontSize: 15, color: C.ink, paddingRight: 78, paddingVertical: 0 },
  fieldMeta: { position: "absolute", right: 0, top: 36, flexDirection: "row", alignItems: "center", gap: 8 },
  museFix: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  museBadge: {
    position: "absolute", top: -4, right: -4, minWidth: 15, height: 15, borderRadius: 8, backgroundColor: C.red, borderWidth: 1.5, borderColor: "#fff", alignItems: "center", justifyContent: "center",
  },
  popover: { marginTop: 10, borderWidth: 1, borderColor: C.lilacBorder, backgroundColor: C.lilac, borderRadius: 12, padding: 12, gap: 8 },
  popButton: { height: 34, paddingHorizontal: 14, borderRadius: 8, backgroundColor: C.chip, alignItems: "center", justifyContent: "center" },
  museGenerate: { flexDirection: "row", alignItems: "center", gap: 11, padding: 14, marginTop: 18, borderRadius: 12 },
  museGenerateOrb: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  intro: { alignItems: "center", paddingTop: 12, paddingHorizontal: 10, paddingBottom: 23 },
  introIcon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  settingRow: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 9, backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center" },
  settingEditor: { paddingBottom: 16, paddingLeft: 48, gap: 12 },
  error: { fontSize: 12, color: C.danger },
  placeRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 52 },
  linkItem: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 50, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  addLink: { alignSelf: "flex-start", height: 36, paddingHorizontal: 14, borderRadius: 8, backgroundColor: C.chip, flexDirection: "row", alignItems: "center", gap: 5 },
  hint: { marginTop: 12, fontSize: 12, color: C.muted, textAlign: "center" },
  radioRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 58, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#b5b5b5", alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.blue },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 58 },
  audienceNote: { flexDirection: "row", gap: 10, backgroundColor: "#f7f4ff", borderRadius: 11, padding: 13, marginTop: 16 },
  reviewCard: { borderRadius: 12, overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  shareRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 12 },
  brandDot: { width: 34, height: 34, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  brandText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: "#b5b5b5", alignItems: "center", justifyContent: "center" },
  kitButton: { flexDirection: "row", alignItems: "center", gap: 11, padding: 13, borderRadius: 12 },
  kitOrb: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  savedSection: { marginTop: 16, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hairline },
  savedRow: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
  savedMain: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 12 },
  savedThumb: { width: 48, height: 60, borderRadius: 8 },
  promoShortcuts: { flexDirection: "row", gap: 6, marginTop: 8 },
  promoButton: { flex: 1, height: 58, borderRadius: 10, borderWidth: 1, borderColor: C.lilacBorder, backgroundColor: C.lilac, alignItems: "center", justifyContent: "center", gap: 3 },
  publish: { height: 44, borderRadius: 9, backgroundColor: C.blue, alignItems: "center", justifyContent: "center", marginTop: 18 },
  back: { flexDirection: "row", alignItems: "center", gap: 4, marginHorizontal: 12, paddingHorizontal: 6, minHeight: 44, alignSelf: "flex-start" },
});
