import { jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { storyReaction } from "#/db/schema";
import { catchAsyncFn } from "#/errors/error-handler";
import { authMiddleware } from "#/middleware/auth.middleware";
import type { ServerOk } from "#/server/_types";
import {
  getReactionsCountSchema,
  toggleReactionSchema,
  type ToggleReactionData,
} from "#/validation/reaction.schema";
import { createServerFn } from "@tanstack/react-start";
import { and, count, eq } from "drizzle-orm";

export const toggleReaction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(toggleReactionSchema)
  .handler(
    catchAsyncFn(
      async ({
        data,
        context,
      }): ServerOk<{
        storyId: string;
        reaction: ToggleReactionData["reaction"] | null;
      }> => {
        const { session } = context;
        const { storyId, reaction } = data;

        const existingRows = await db
          .select()
          .from(storyReaction)
          .where(
            and(
              eq(storyReaction.storyId, storyId),
              eq(storyReaction.userId, session.user.id),
            ),
          )
          .limit(1);

        const existing = existingRows[0];

        if (!existing) {
          await db.insert(storyReaction).values({
            storyId,
            userId: session.user.id,
            reaction,
          });

          return jsonOk({
            data: { storyId, reaction },
            message: "Reaction saved successfully",
          });
        }

        if (existing.reaction === reaction) {
          await db
            .delete(storyReaction)
            .where(
              and(
                eq(storyReaction.storyId, storyId),
                eq(storyReaction.userId, session.user.id),
              ),
            );

          return jsonOk({
            data: { storyId, reaction: null },
            message: "Reaction removed successfully",
          });
        }

        await db
          .update(storyReaction)
          .set({ reaction })
          .where(
            and(
              eq(storyReaction.storyId, storyId),
              eq(storyReaction.userId, session.user.id),
            ),
          );

        return jsonOk({
          data: { storyId, reaction },
          message: "Reaction updated successfully",
        });
      },
    ),
  );

export const getReactionsCount = createServerFn({ method: "GET" })
  .inputValidator(getReactionsCountSchema)
  .handler(
    catchAsyncFn(
      async ({
        data,
      }): ServerOk<{ storyId: string; likes: number; dislikes: number }> => {
        const { storyId } = data;
        const [{ likes }] = await db
          .select({ likes: count() })
          .from(storyReaction)
          .where(
            and(
              eq(storyReaction.storyId, storyId),
              eq(storyReaction.reaction, "like"),
            ),
          );

        const [{ dislikes }] = await db
          .select({ dislikes: count() })
          .from(storyReaction)
          .where(
            and(
              eq(storyReaction.storyId, storyId),
              eq(storyReaction.reaction, "dislike"),
            ),
          );

        return jsonOk({
          data: { storyId, likes, dislikes },
          message: "Reaction counts loaded successfully",
        });
      },
    ),
  );
