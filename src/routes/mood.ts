import { Router, Response } from "express";

import {
  AuthRequest,
  auth
} from "../middleware/auth.js";

import { supabase } from "../services/supabase.js";

const router = Router();

router.get(
  "/",
  auth,
  async (
    req: AuthRequest,
    res: Response
  ) => {

    const { data, error } =
      await supabase
        .from("mood_entries")
        .select("*")
        .eq(
          "user_id",
          req.user!.id
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.json(data);
  }
);

router.post(
  "/",
  auth,
  async (
    req: AuthRequest,
    res: Response
  ) => {

    const {
      mood,
      energy,
      note
    } = req.body;

    const { data, error } =
      await supabase
        .from("mood_entries")
        .insert({
          user_id:
            req.user!.id,
          mood,
          energy,
          note
        })
        .select()
        .single();

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.json(data);
  }
);

export default router;
