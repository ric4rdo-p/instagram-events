import { supabase } from "./supabase";

let channelCounter = 0;

// Runs `query` now and again whenever a row changes in one of `tables`,
// passing the result to `onData`. Replaces Firestore's onSnapshot.
// `tables` is a list of { table, filter } where filter uses Supabase's
// realtime syntax, e.g. "id=eq.123". Returns an unsubscribe function.
export const liveQuery = ({ tables, query, onData, onError }) => {
  let active = true;
  let requestId = 0;
  let debounce = null;

  const run = async () => {
    const id = ++requestId;
    const { data, error } = await query();
    if (!active || id !== requestId) return;
    if (error) {
      onError ? onError(error) : console.log(error);
    } else {
      onData(data);
    }
  };

  // Bulk updates (e.g. a username change) fire many events at once.
  const scheduleRun = () => {
    clearTimeout(debounce);
    debounce = setTimeout(run, 150);
  };

  const channel = supabase.channel(`live-${++channelCounter}`);
  tables.forEach(({ table, filter }) => {
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table, ...(filter && { filter }) },
      scheduleRun
    );
  });
  // SUBSCRIBED can fire before the server is listening for database
  // changes, and changes are missed while disconnected. Refetch once the
  // server confirms its listener and after every (re)subscribe.
  channel.on("system", {}, (payload) => {
    if (payload?.extension === "postgres_changes" && payload?.status === "ok") {
      scheduleRun();
    }
  });
  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") scheduleRun();
  });
  run();

  return () => {
    active = false;
    clearTimeout(debounce);
    supabase.removeChannel(channel);
  };
};

// Realtime "in" filters accept at most 100 values; beyond that listen to
// the whole table and let the query do the filtering.
export const inFilter = (column, values) =>
  values.length <= 100 ? `${column}=in.(${values.join(",")})` : undefined;
