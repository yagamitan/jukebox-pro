import bcrypt from "bcrypt";
import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const neonTiger = await createUser({
    username: "neon_tiger",
    password: await bcrypt.hash("password123", 10),
  });

  const cosmicPanda = await createUser({
    username: "cosmic_panda",
    password: await bcrypt.hash("password456", 10),
  });

  const tracks = [];
  for (let i = 1; i <= 20; i++) {
    const track = await createTrack(`Track ${i}`, i * 50000);
    tracks.push(track);
  }

  const neonTigerPlaylist = await createPlaylist(
    "Neon Tiger's Night Drive",
    "Synth tracks for midnight driving",
    neonTiger.id,
  );

  const cosmicPandaPlaylist = await createPlaylist(
    "Cosmic Panda's Space Snacks",
    "Music for floating through space",
    cosmicPanda.id,
  );
  for (let i = 0; i < 5; i++) {
    await createPlaylistTrack(neonTigerPlaylist.id, tracks[i].id);
    await createPlaylistTrack(cosmicPandaPlaylist.id, tracks[i + 5].id);
  }
}
