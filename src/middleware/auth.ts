import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export async function auth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {

    const header =
      req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }

    const token =
      header.replace("Bearer ", "");

    const supabase = createClient(
      env.supabaseUrl,
      env.supabaseServiceRoleKey
    );

    const {
      data,
      error
    } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid authentication token"
      });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email
    };

    next();

  } catch {

    return res.status(401).json({
      error: "Authentication failed"
    });

  }
}
