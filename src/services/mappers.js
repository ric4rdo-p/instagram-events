// Convert Supabase rows into the shapes the UI was written against
// (originally Firestore documents). User ids are exposed as `email`
// because the UI uses that field as the user key everywhere.

export const toTimestamp = (value) =>
  value ? { seconds: Math.floor(new Date(value).getTime() / 1000) } : null;

export const mapUser = (row) =>
  row && {
    ...row,
    email: row.id,
    owner_uid: row.id,
    createdAt: toTimestamp(row.created_at),
  };

export const mapPost = (row) => ({
  ...row,
  owner_email: row.owner_id,
  owner_uid: row.owner_id,
  imageUrl: row.image_url,
  createdAt: toTimestamp(row.created_at),
});

export const mapStory = mapPost;

export const mapReel = (row) => ({
  ...row,
  owner_email: row.owner_id,
  videoUrl: row.video_url,
  createdAt: toTimestamp(row.created_at),
});

export const mapChat = (row) => ({
  ...row,
  email: row.peer_id,
});

export const mapMessage = (row) => ({
  ...row,
  timestamp: toTimestamp(row.created_at),
});
