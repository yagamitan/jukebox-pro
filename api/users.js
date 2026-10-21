import bcrypt from "bcrypt";
import express from "express";

import { createUser, getUserByUsername } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = await createUser({
        username: req.body.username,
        password: hashedPassword,
      });

      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      next(error);
    }
  },
);
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const user = await getUserByUsername(req.body.username);

      if (!user) {
        return res.status(401).send("Invalid username or password.");
      }
      const passwordsMatch = await bcrypt.compare(
        req.body.password,
        user.password,
      );

      if (!passwordsMatch) {
        return res.status(401).send("Invalid username or password.");
      }

      const token = createToken({ id: user.id });
      res.send(token);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
