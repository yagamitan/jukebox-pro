import express from "express";
import { getPlaylistsByTrackIdAndOwnerId } from "#db/queries/playlists";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id/playlists", requireUser, async (req, res, next) => {
  try {
    const track = await getTrackById(req.params.id);

    if (!track) {
      return res.status(404).send("Track not found.");
    }
    const playlists = await getPlaylistsByTrackIdAndOwnerId(
      track.id,
      req.user.id,
    );

    res.send(playlists);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});
