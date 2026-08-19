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
        .from("profiles")
        .select("*")
        .eq(
          "user_id",
          req.user!.id
        )
        .single();

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.json(data);
  }
);

router.patch(
  "/",
  auth,
  async (
    req: AuthRequest,
    res: Response
  ) => {

    const {
      education,
      preferred_method,
      focus_minutes,
      goal
    } = req.body;

    const { data, error } =
      await supabase
        .from("profiles")
        .upsert({
          user_id:
            req.user!.id,
          education,
          preferred_method,
          focus_minutes,
          goal,
          updated_at:
            new Date().toISOString()
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
