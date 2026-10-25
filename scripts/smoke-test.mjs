// End-to-end check of a Supabase project against what the app needs.
// Usage: npm run smoke-test   (reads EXPO_PUBLIC_SUPABASE_* from .env)
//
// Signs in two throwaway anonymous users, exercises auth, storage,
// realtime, every database function and the main security rules, then
// deletes everything it created.
import { createClient } from "@supabase/supabase-js";
import assert from "node:assert/strict";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const newClient = () =>
  createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const step = async (name, fn) => {
  process.stdout.write(`- ${name} ... `);
  await fn();
  console.log("ok");
};

const must = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return data;
};

// 1x1 transparent PNG
const PNG = Uint8Array.from(
  atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="),
  (c) => c.charCodeAt(0)
);

const a = newClient();
const b = newClient();
let A, B, postId, imagePath;

try {
  await step("anonymous sign-in", async () => {
    const ra = await a.auth.signInAnonymously();
    if (ra.error?.message?.toLowerCase().includes("anonymous")) {
      throw new Error(
        `${ra.error.message} -> enable it in Authentication > Sign In / Providers > "Allow anonymous sign-ins"`
      );
    }
    A = must(ra).user.id;
    B = must(await b.auth.signInAnonymously()).user.id;
  });

  await step("profile row created by trigger", async () => {
    const me = must(await a.from("users").select("*").eq("id", A).single());
    assert.match(me.username, /^user_/);
    assert.ok(me.profile_picture.startsWith("https://"));
    must(await a.from("users").update({ country: "US" }).eq("id", A));
  });

  await step("storage upload + public URL", async () => {
    imagePath = `${A}/smoke-test.png`;
    must(
      await a.storage
        .from("media")
        .upload(imagePath, PNG.buffer, { contentType: "image/png", upsert: true })
    );
    const { publicUrl } = a.storage.from("media").getPublicUrl(imagePath).data;
    const res = await fetch(publicUrl);
    assert.equal(res.status, 200, `GET ${publicUrl} returned ${res.status}`);

    const denied = await a.storage.from("media").upload(`${B}/nope.png`, PNG.buffer, {
      contentType: "image/png",
    });
    assert.ok(denied.error, "uploading into another user's folder should fail");
  });

  await step("create post", async () => {
    const { publicUrl } = a.storage.from("media").getPublicUrl(imagePath).data;
    postId = must(
      await a
        .from("posts")
        .insert({ image_url: publicUrl, username: "smoke", owner_id: A, caption: "smoke test" })
        .select("id")
        .single()
    ).id;
  });

  await step("realtime delivers a like to the post owner", async () => {
    const received = new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("no realtime event within 15s (is the posts table in the supabase_realtime publication?)")),
        15000
      );
      let liked = false;
      const like = async () => {
        if (liked) return;
        liked = true;
        must(await b.rpc("toggle_post_like", { p_post_id: postId }));
      };
      const channel = a
        .channel("smoke")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "posts", filter: `id=eq.${postId}` },
          () => {
            clearTimeout(timer);
            a.removeChannel(channel);
            resolve();
          }
        )
        // SUBSCRIBED can arrive before the server listens for database
        // changes; wait for its confirmation (with a fallback) first.
        .on("system", {}, (payload) => {
          if (payload?.extension === "postgres_changes" && payload?.status === "ok") like();
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") setTimeout(like, 5000);
        });
    });
    await received;
    const post = must(await a.from("posts").select("*").eq("id", postId).single());
    assert.deepEqual(post.likes_by_users, [B]);
  });

  await step("comments: add, like, delete", async () => {
    must(await b.rpc("add_comment", { p_post_id: postId, p_comment: "nice" }));
    must(await a.rpc("toggle_comment_like", { p_post_id: postId, p_index: 0 }));
    let post = must(await a.from("posts").select("comments").eq("id", postId).single());
    assert.equal(post.comments[0].comment, "nice");
    assert.deepEqual(post.comments[0].likes_by_users, [A]);
    must(await a.rpc("delete_comment", { p_post_id: postId, p_index: 0 }));
    post = must(await a.from("posts").select("comments").eq("id", postId).single());
    assert.equal(post.comments.length, 0);
  });

  await step("other users cannot edit your post", async () => {
    must(await b.from("posts").update({ caption: "pwned" }).eq("id", postId));
    const post = must(await a.from("posts").select("caption").eq("id", postId).single());
    assert.equal(post.caption, "smoke test");
  });

  await step("follow request, accept, unfollow", async () => {
    must(await b.rpc("toggle_follow_request", { p_target: A }));
    must(await a.rpc("respond_follow_request", { p_requester: B, p_accept: true }));
    let me = must(await a.from("users").select("followers").eq("id", A).single());
    assert.deepEqual(me.followers, [B]);
    must(await b.rpc("unfollow", { p_target: A }));
    me = must(await a.from("users").select("followers").eq("id", A).single());
    assert.deepEqual(me.followers, []);
  });

  await step("direct messages", async () => {
    must(await a.rpc("send_message", { p_to: B, p_message: "hello" }));
    const inbox = must(await b.from("chats").select("*"));
    assert.equal(inbox.length, 1);
    assert.equal(inbox[0].peer_id, A);
    assert.equal(inbox[0].status, "unseen");
    const msgs = must(await b.from("messages").select("message, who").eq("peer_id", A));
    assert.deepEqual(msgs, [{ message: "hello", who: "user" }]);
    must(await b.from("chats").update({ status: "seen" }).eq("owner_id", B).eq("peer_id", A));
  });

  await step("saved posts, username, profile picture, report", async () => {
    must(await a.rpc("toggle_own_list", { p_column: "saved_posts", p_value: postId }));
    const newName = `smoke_${A.slice(0, 8)}`;
    assert.equal(must(await a.rpc("change_username", { p_username: newName })), true);
    must(await a.rpc("update_profile_picture", { p_url: "https://example.com/me.jpg" }));
    const post = must(await a.from("posts").select("username, profile_picture").eq("id", postId).single());
    assert.deepEqual(post, { username: newName, profile_picture: "https://example.com/me.jpg" });
    must(await b.from("reports").insert({ reported_by: B, payload: { post: { id: postId } } }));
  });

  console.log("\nAll checks passed. Supabase is ready for the app.");
} catch (error) {
  console.log("FAILED");
  console.error(`\n${error.message}`);
  process.exitCode = 1;
} finally {
  if (imagePath) await a.storage.from("media").remove([imagePath]);
  if (A) await a.rpc("delete_own_account");
  if (B) await b.rpc("delete_own_account");
  a.removeAllChannels();
  b.removeAllChannels();
}
