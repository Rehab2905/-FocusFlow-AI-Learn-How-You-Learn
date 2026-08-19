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
        .from("conversations")
        .select("*")
        .eq(
          "user_id",
          req.user!.id
        )
        .order(
          "updated_at",
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

    const title =
      req.body.title ||
      "New FocusFlow Chat";

    const { data, error } =
      await supabase
        .from("conversations")
        .insert({
          user_id:
            req.user!.id,
          title
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

router.delete(
  "/:id",
  auth,
  async (
    req: AuthRequest,
    res: Response
  ) => {

    const { error } =
      await supabase
        .from("conversations")
        .delete()
        .eq(
          "id",
          req.params.id
        )
        .eq(
          "user_id",
          req.user!.id
        );

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.json({
      success: true
    });
  }
);

export default router;
