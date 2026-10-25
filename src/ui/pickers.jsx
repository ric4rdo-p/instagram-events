import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "./Icon";
import { Tap } from "./common";
import { C } from "./theme";
import { clock, monthLong, sameDay, shortDay } from "./data";

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function CalendarPicker({ value, minDate, onSelect }) {
  const [month, setMonth] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));
  const min = startOfDay(minDate);
  const today = new Date();
  const canPrev = month > new Date(min.getFullYear(), min.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: month.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  const shift = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  return (
    <View style={s.calendar}>
      <View style={s.calendarHead}>
        <Tap onPress={() => canPrev && shift(-1)} disabled={!canPrev} style={s.calendarNav} accessibilityLabel="Previous month">
          <Icon name="back" size={20} color={canPrev ? C.ink : C.border} />
        </Tap>
        <Text style={{ fontSize: 15, fontWeight: "700", color: C.ink }}>{monthLong(month)} {month.getFullYear()}</Text>
        <Tap onPress={() => shift(1)} style={s.calendarNav} accessibilityLabel="Next month">
          <Icon name="chevron" size={20} />
        </Tap>
      </View>
      <View style={s.calendarRow}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <Text key={i} style={s.calendarWeekday}>{d}</Text>
        ))}
      </View>
      <View style={[s.calendarRow, { flexWrap: "wrap" }]}>
        {cells.map((d, i) => {
          if (!d) return <View key={`pad${i}`} style={s.calendarCell} />;
          const disabled = d < min;
          const selected = sameDay(d, value);
          const isToday = sameDay(d, today);
          return (
            <Tap key={d.getDate()} style={s.calendarCell} disabled={disabled} onPress={() => onSelect(d)}>
              <View style={[s.calendarDay, isToday && !selected && { borderWidth: 1, borderColor: C.ink }, selected && { backgroundColor: C.blue }]}>
                <Text style={{ fontSize: 14, fontWeight: selected || isToday ? "700" : "400", color: selected ? "#fff" : disabled ? "#c7c7c7" : C.ink }}>{d.getDate()}</Text>
              </View>
            </Tap>
          );
        })}
      </View>
    </View>
  );
}

// 12:00 AM through 11:45 PM in 15 minute steps
const TIMES = Array.from({ length: 96 }, (_, i) => i * 15);
const TIME_ROW = 42;
const timeLabel = (m) => clock(new Date(2000, 0, 1, Math.floor(m / 60), m % 60));

export function TimeDropdown({ value, onSelect }) {
  const ref = useRef(null);
  const minutes = value.getHours() * 60 + value.getMinutes();
  return (
    <View style={s.dropdown}>
      <ScrollView
        ref={ref}
        nestedScrollEnabled
        onLayout={() => ref.current?.scrollTo({ y: Math.max(0, TIMES.indexOf(minutes) - 2) * TIME_ROW, animated: false })}
      >
        {TIMES.map((m) => {
          const active = m === minutes;
          return (
            <Tap key={m} style={[s.timeRow, active && { backgroundColor: "#eef7ff" }]} onPress={() => onSelect(m)}>
              <Text style={{ flex: 1, fontSize: 15, color: active ? C.blue : C.ink, fontWeight: active ? "700" : "400" }}>{timeLabel(m)}</Text>
              {active ? <Icon name="check" size={18} color={C.blue} /> : null}
            </Tap>
          );
        })}
      </ScrollView>
    </View>
  );
}

// One "Starts"/"Ends" line: a date field that opens a calendar and a time field that opens a dropdown
export function WhenRow({ label, value, onChange, minDate, open, onOpen }) {
  const setDay = (d) => {
    onChange(new Date(d.getFullYear(), d.getMonth(), d.getDate(), value.getHours(), value.getMinutes()));
    onOpen(null);
  };
  const setTime = (m) => {
    onChange(new Date(value.getFullYear(), value.getMonth(), value.getDate(), Math.floor(m / 60), m % 60));
    onOpen(null);
  };
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 12, color: C.muted }}>{label}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Tap style={[s.pickerField, { flex: 1.3 }, open === "date" && s.pickerFieldOpen]} onPress={() => onOpen(open === "date" ? null : "date")}>
          <Icon name="calendar" size={17} color={C.muted} />
          <Text style={s.pickerText} numberOfLines={1}>{shortDay(value)}</Text>
        </Tap>
        <Tap style={[s.pickerField, { flex: 1 }, open === "time" && s.pickerFieldOpen]} onPress={() => onOpen(open === "time" ? null : "time")}>
          <Text style={s.pickerText}>{clock(value)}</Text>
          <View style={{ transform: [{ rotate: open === "time" ? "180deg" : "0deg" }] }}>
            <Icon name="chevronDown" size={17} color={C.muted} />
          </View>
        </Tap>
      </View>
      {open === "date" ? <CalendarPicker value={value} minDate={minDate} onSelect={setDay} /> : null}
      {open === "time" ? <TimeDropdown value={value} onSelect={setTime} /> : null}
    </View>
  );
}

const s = StyleSheet.create({
  pickerField: {
    height: 44, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 10, backgroundColor: "#fafafa", paddingHorizontal: 12,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8,
  },
  pickerFieldOpen: { borderColor: C.blue, backgroundColor: "#fff" },
  pickerText: { flexShrink: 1, fontSize: 15, color: C.ink },
  calendar: { borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 12, padding: 8 },
  calendarHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  calendarNav: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  calendarRow: { flexDirection: "row" },
  calendarWeekday: { width: `${100 / 7}%`, textAlign: "center", fontSize: 11, fontWeight: "700", color: C.muted, paddingVertical: 4 },
  calendarCell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: "center", justifyContent: "center" },
  calendarDay: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  dropdown: { height: 5 * TIME_ROW, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, borderRadius: 12, overflow: "hidden" },
  timeRow: { height: TIME_ROW, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.hairline },
});
