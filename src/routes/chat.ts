import {
  Router,
  Response
} from "express";

import {
  AuthRequest,
  auth
} from "../middleware/auth.js";

import { supabase } from "../services/supabase.js";
import { openai } from "../services/openai.js";

const router = Router();

router.post(
  "/",
  auth,
  async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const userId = req.user!.id;

      const {
        conversationId,
        message
      } = req.body;

      if (
        !conversationId ||
        !message
      ) {
        return res.status(400).json({
          error: "conversationId and message are required"
        });
      }

      const {
        data: conversation
      } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", userId)
        .single();

      if (!conversation) {
        return res.status(404).json({
          error: "Conversation not found"
        });
      }

      await supabase
        .from("messages")
        .insert({
          conversation_id:
            conversationId,
          user_id: userId,
          role: "user",
          content: message
        });

      const {
        data: history
      } = await supabase
        .from("messages")
        .select("role, content")
        .eq(
          "conversation_id",
          conversationId
        )
        .order(
          "created_at",
          {
            ascending: true
          }
        )
        .limit(30);

      const response =
        await openai.chat.completions.create({

          model: "gpt-4o-mini",

          messages: [

            {
              role: "system",

              content: `
You are FocusFlow AI.

You are an adaptive study and
productivity assistant.

Help users:

- organize tasks
- study
- break overwhelming tasks
- plan projects
- improve focus
- discover learning strategies

Be supportive and practical.

Never shame the user.

If the user mentions ADHD,
disability, anxiety, depression,
or another health condition:

Do not diagnose.

Do not claim to treat.

Do not recommend medication changes.

Provide general educational,
organizational and productivity
support only.

If the user is overwhelmed,
give them one small next step.
`
            },

            ...(history || []).map(
              (item) => ({
                role:
                  item.role as
                  "user" | "assistant",

                content:
                  item.content
              })
            )

          ]

        });

      const answer =
        response.choices[0]
          ?.message
          ?.content ||
        "Let's take one small step together.";

      await supabase
        .from("messages")
        .insert({
          conversation_id:
            conversationId,
          user_id: userId,
          role: "assistant",
          content: answer
        });

      await supabase
        .from("conversations")
        .update({
          updated_at:
            new Date().toISOString()
        })
        .eq(
          "id",
          conversationId
        )
        .eq(
          "user_id",
          userId
        );

      return res.json({
        answer
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error: "AI request failed"
      });

    }

  }
);

export default router;
