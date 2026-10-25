import { StyleSheet, Text, View } from "react-native";
import Icon from "./Icon";
import { BottomModal, Tap } from "./common";
import { C } from "./theme";

const options = [
  { id: "reel", label: "Reel", icon: "reels" },
  { id: "edits", label: "Edits", icon: "edits" },
  { id: "post", label: "Post", icon: "grid" },
  { id: "story", label: "Story", icon: "story" },
  { id: "highlights", label: "Story highlight", icon: "highlights" },
  { id: "live", label: "Live", icon: "live" },
  { id: "fundraiser", label: "Fundraiser", icon: "fundraiser" },
  { id: "event", label: "Event", icon: "calendar", isNew: true },
];

// Instagram's "Create" sheet; only Event is wired up in this demo
export default function CreateMenu({ onClose, onSelect }) {
  return (
    <BottomModal onClose={onClose}>
      <View style={s.handle} />
      <Text style={s.title}>Create</Text>
      {options.map((o) => (
        <Tap
          key={o.id}
          style={s.row}
          onPress={() => {
            onClose();
            onSelect(o);
          }}
        >
          <Icon name={o.icon} color={o.isNew ? C.pink : C.ink} />
          <Text style={[s.label, o.isNew && { fontWeight: "700" }]}>{o.label}</Text>
          {o.isNew ? (
            <View style={s.badge}>
              <Text style={s.badgeText}>NEW</Text>
            </View>
          ) : null}
        </Tap>
      ))}
    </BottomModal>
  );
}

const s = StyleSheet.create({
  handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, marginTop: 8 },
  title: { textAlign: "center", fontSize: 16, fontWeight: "700", color: C.ink, paddingTop: 12, paddingBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 52, paddingHorizontal: 20, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hairline },
  label: { flex: 1, fontSize: 15, color: C.ink },
  badge: { backgroundColor: C.red, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 6 },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700", letterSpacing: 0.4 },
});
