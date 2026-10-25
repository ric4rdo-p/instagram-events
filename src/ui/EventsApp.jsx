import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, KeyboardAvoidingView, Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionSheet, MobileNav, NAV_HEIGHT, Toast } from "./common";
import HomeScreen from "./HomeScreen";
import EventsScreen from "./EventsScreen";
import SearchScreen from "./SearchScreen";
import DetailScreen from "./DetailScreen";
import ProfileScreen from "./ProfileScreen";
import CreateScreen from "./CreateScreen";
import StoryViewer from "./StoryViewer";
import CreateMenu from "./CreateMenu";
import { ME, events, seedComments, seedExperiences } from "./data";

// UI-only port of the Events design. All state lives in memory; nothing is persisted.
export default function EventsApp() {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState("home");
  const [returnPage, setReturnPage] = useState("home");
  const [detailFrom, setDetailFrom] = useState("events");
  const [eventId, setEventId] = useState(1);
  const [homeEventsMode, setHomeEventsMode] = useState("full");
  const [sheet, setSheet] = useState(null);
  const [storyIndex, setStoryIndex] = useState(null);
  const [toast, setToast] = useState(null);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [profileTab, setProfileTab] = useState("posts");
  const [commentsByEvent, setCommentsByEvent] = useState(seedComments);
  const [experiencesByEvent, setExperiencesByEvent] = useState(seedExperiences);
  const allEvents = useMemo(() => [...events, ...createdEvents], [createdEvents]);
  const findEvent = (id) => allEvents.find((e) => e.id === id) ?? events[0];
  const showToast = useCallback((message) => setToast({ message }), []);
  const clearToast = useCallback(() => setToast(null), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const navigate = (next) => {
    if (next === "profile") setProfileTab("posts");
    setPage(next);
  };
  const openEvent = (id) => {
    setEventId(id);
    if (page !== "detail") setDetailFrom(page);
    setStoryIndex(null);
    setPage("detail");
  };
  const openCreate = () => {
    if (page !== "create") setReturnPage(page);
    setPage("create");
  };
  const setEventsMode = (mode) => {
    const previous = homeEventsMode;
    setHomeEventsMode(mode);
    if (mode === "hidden") {
      setToast({ message: "Events hidden from Home. Turn them back on from the menu on your profile.", actionLabel: "Undo", onAction: () => setHomeEventsMode(previous) });
    } else if (mode === "compact") {
      setToast({ message: "You’ll see fewer events on Home." });
    }
  };

  // Android hardware back mirrors the in-app back buttons
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (page === "detail") setPage(detailFrom);
      else if (page === "create") setPage(returnPage);
      else if (page !== "home") setPage("home");
      else return false;
      return true;
    });
    return () => sub.remove();
  }, [page, detailFrom, returnPage]);

  let content;
  if (page === "search") content = <SearchScreen onOpen={openEvent} />;
  else if (page === "detail")
    content = (
      <DetailScreen
        key={eventId}
        event={findEvent(eventId)}
        comments={commentsByEvent[eventId] ?? []}
        experiences={experiencesByEvent[eventId] ?? []}
        onAddComment={(text) => setCommentsByEvent((all) => ({ ...all, [eventId]: [...(all[eventId] ?? []), { id: `c${Date.now()}`, user: ME, text, ago: "now", likes: 0 }] }))}
        onAddExperience={(item) => setExperiencesByEvent((all) => ({ ...all, [eventId]: [item, ...(all[eventId] ?? [])] }))}
        onOpenEvent={openEvent}
        onBack={() => setPage(detailFrom)}
        onToast={showToast}
      />
    );
  else if (page === "events") content = <EventsScreen onOpen={openEvent} onBack={() => setPage("home")} onOpenStory={setStoryIndex} onCreate={openCreate} />;
  else if (page === "profile")
    content = (
      <ProfileScreen
        key={profileTab}
        hosted={allEvents.filter((e) => e.host === ME)}
        initialTab={profileTab}
        onCreate={openCreate}
        onOpenEvent={openEvent}
        onSettings={() => setSheet("settings")}
      />
    );
  else if (page === "create")
    content = (
      <CreateScreen
        onClose={() => setPage(returnPage)}
        onPublish={(created, promo) => {
          setCreatedEvents((list) => [...list, created]);
          setProfileTab("events");
          setPage("profile");
          setToast({
            message: `Event published${promo.length ? ` with ${promo.length} promo ${promo.length === 1 ? "item" : "items"}` : ""}. It’s on your profile under Events.`,
          });
        }}
      />
    );
  else
    content = (
      <HomeScreen eventsMode={homeEventsMode} onEvents={() => setPage("events")} onOpenEvent={openEvent} onEventsMenu={() => setSheet("homeEvents")} onCreate={() => setSheet("create")} />
    );

  const showNav = page !== "create";

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style={page === "detail" ? "light" : "dark"} />
      {page !== "detail" ? <View style={{ height: insets.top, backgroundColor: "#fff" }} /> : null}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {content}
      </KeyboardAvoidingView>
      {showNav ? <MobileNav active={page} onNavigate={navigate} /> : null}

      {storyIndex !== null ? <StoryViewer index={storyIndex} onIndex={setStoryIndex} onClose={() => setStoryIndex(null)} onOpenEvent={openEvent} /> : null}

      {sheet === "homeEvents" ? (
        <ActionSheet
          title="Events on Home"
          description="Muse picks events near you and ones your friends are going to."
          onClose={closeSheet}
          options={[
            homeEventsMode === "full"
              ? { label: "Show fewer events", onSelect: () => setEventsMode("compact") }
              : { label: "Show more events", onSelect: () => setEventsMode("full") },
            { label: "Hide events from Home", onSelect: () => setEventsMode("hidden"), destructive: true },
          ]}
        />
      ) : null}
      {sheet === "create" ? (
        <CreateMenu
          onClose={closeSheet}
          onSelect={(option) => (option.id === "event" ? openCreate() : showToast(`${option.label} isn’t part of this demo. Try Event.`))}
        />
      ) : null}
      {sheet === "settings" ? (
        <ActionSheet
          title="Events on Home"
          description="Choose how many events appear in your Home feed."
          onClose={closeSheet}
          options={[
            { label: "Show all events", onSelect: () => setHomeEventsMode("full"), selected: homeEventsMode === "full" },
            { label: "Show fewer events", onSelect: () => setHomeEventsMode("compact"), selected: homeEventsMode === "compact" },
            { label: "Don’t show events", onSelect: () => setHomeEventsMode("hidden"), selected: homeEventsMode === "hidden" },
          ]}
        />
      ) : null}
      {toast ? <Toast toast={toast} onDone={clearToast} bottom={(showNav ? NAV_HEIGHT + insets.bottom : insets.bottom) + (page === "detail" ? 80 : 14)} /> : null}
    </View>
  );
}
