import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  BookOpen,
  Calendar,
  MessageCircle,
  PenLine,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { renderStoryContent } from "../shared/render-story-content";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStoryWithCategory } from "#/server/story";
import { removeReadLater, saveReadLater } from "#/server/readLater";
import { toggleReaction } from "#/server/reaction";
import { formatStoryDate } from "#/types/story";
import { authClient } from "#/lib/auth-client";
import { toast } from "sonner";

type StoryWithStats = Awaited<
  ReturnType<typeof getStoryWithCategory>
>["data"];

function updateStoryCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  storyId: string,
  updater: (story: StoryWithStats) => StoryWithStats,
) {
  queryClient.setQueryData(["story", "sheet", storyId], (old: StoryWithStats | undefined) =>
    old ? updater(old) : old,
  );
  queryClient.setQueryData(["story", "public", storyId], (old: StoryWithStats | undefined) =>
    old ? updater(old) : old,
  );

  const updateList = (old: unknown) => {
    if (!old || typeof old !== "object") {
      return old;
    }
    const value = old as { stories?: StoryWithStats[] };
    if (!Array.isArray(value.stories)) {
      return old;
    }

    return {
      ...value,
      stories: value.stories.map((story) =>
        story.id === storyId ? updater(story) : story,
      ),
    };
  };

  queryClient.setQueriesData({ queryKey: ["stories", "public"] }, updateList);
  queryClient.setQueriesData({ queryKey: ["stories", "me"] }, updateList);
}

// Story Viewer Sheet
export function StoryViewerSheet({
  storyId,
  onClose,
  showEditLink = false,
}: {
  storyId: string | null;
  onClose: () => void;
  showEditLink?: boolean;
}) {
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const viewerUser = session.data?.user;

  const { data: story, isPending, isError } = useQuery({
    queryKey: ["story", "sheet", storyId],
    enabled: Boolean(storyId),
    queryFn: async () => {
      const res = await getStoryWithCategory({ data: { storyId: storyId! } });
      return res.data;
    },
  });

  const reactionMutation = useMutation({
    mutationFn: async ({
      storyId,
      reaction,
    }: {
      storyId: string;
      reaction: "like" | "dislike";
    }) => {
      const res = await toggleReaction({ data: { storyId, reaction } });
      return res.data.reaction;
    },
    onMutate: async ({
      storyId,
      reaction,
    }: {
      storyId: string;
      reaction: "like" | "dislike";
    }) => {
      const previous = queryClient.getQueryData<StoryWithStats>([
        "story",
        "sheet",
        storyId,
      ]);

      if (!previous) {
        return { previous };
      }

      updateStoryCaches(queryClient, storyId, (current) => {
        const prevReaction = current.stats.myReaction;
        const nextReaction = prevReaction === reaction ? null : reaction;
        const likes = current.stats.likes;
        const dislikes = current.stats.dislikes;

        let nextLikes = likes;
        let nextDislikes = dislikes;

        if (prevReaction === "like") nextLikes = Math.max(0, nextLikes - 1);
        if (prevReaction === "dislike") nextDislikes = Math.max(0, nextDislikes - 1);
        if (nextReaction === "like") nextLikes += 1;
        if (nextReaction === "dislike") nextDislikes += 1;

        return {
          ...current,
          stats: {
            ...current.stats,
            likes: nextLikes,
            dislikes: nextDislikes,
            myReaction: nextReaction,
          },
        };
      });

      return { previous };
    },
    onError: (_error, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["story", "sheet", vars.storyId], context.previous);
      }
      toast.error("Failed to update reaction.");
    },
    onSettled: (_result, _error, vars) => {
      void queryClient.invalidateQueries({ queryKey: ["story", "sheet", vars.storyId] });
      void queryClient.invalidateQueries({ queryKey: ["stories", "public"] });
      void queryClient.invalidateQueries({ queryKey: ["stories", "me"] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ storyId, isSaved }: { storyId: string; isSaved: boolean }) => {
      if (isSaved) {
        await removeReadLater({ data: { storyId } });
        return false;
      }
      await saveReadLater({ data: { storyId } });
      return true;
    },
    onMutate: async ({
      storyId,
      isSaved,
    }: {
      storyId: string;
      isSaved: boolean;
    }) => {
      const previous = queryClient.getQueryData<StoryWithStats>([
        "story",
        "sheet",
        storyId,
      ]);

      if (!previous) {
        return { previous };
      }

      const nextSaved = !isSaved;
      updateStoryCaches(queryClient, storyId, (current) => ({
        ...current,
        stats: {
          ...current.stats,
          isSaved: nextSaved,
          saves: Math.max(0, current.stats.saves + (nextSaved ? 1 : -1)),
        },
      }));

      return { previous };
    },
    onError: (_error, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["story", "sheet", vars.storyId], context.previous);
      }
      toast.error("Failed to update your Read Later list.");
    },
    onSettled: (_result, _error, vars) => {
      void queryClient.invalidateQueries({ queryKey: ["story", "sheet", vars.storyId] });
      void queryClient.invalidateQueries({ queryKey: ["stories", "public"] });
      void queryClient.invalidateQueries({ queryKey: ["stories", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["read-later", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["read-later", "count", "me"] });
    },
  });

  // Close on Escape key
  useEffect(() => {
    if (!storyId) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [storyId, onClose]);

  // Prevent body scroll while panel is open
  useEffect(() => {
    if (storyId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [storyId]);

  function handleRequireAuth() {
    window.location.assign("/sign-in");
  }

  function handleToggleReaction(nextReaction: "like" | "dislike") {
    if (!story) return;
    if (!viewerUser) {
      handleRequireAuth();
      return;
    }

    reactionMutation.mutate({
      storyId: story.id,
      reaction: nextReaction,
    });
  }

  function handleToggleSave() {
    if (!story) return;
    if (!viewerUser) {
      handleRequireAuth();
      return;
    }

    saveMutation.mutate({
      storyId: story.id,
      isSaved: story.stats.isSaved,
    });
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {storyId && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          <motion.button
            key="backdrop"
            type="button"
            aria-label="Close story viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full flex-col overflow-hidden shadow-2xl sm:max-w-2xl"
            style={{
              backgroundColor: "var(--background)",
              borderLeft: "1px solid var(--border)",
            }}
          >
            <div
              className="flex shrink-0 items-center justify-between px-5 py-3.5"
              style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--card)" }}
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-4 shrink-0" style={{ backgroundColor: "var(--accent-warm)" }} />
                <span
                  className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: "var(--accent-warm)" }}
                >
                  Reading
                </span>
              </div>

              <div className="flex items-center gap-2">
                {showEditLink && story && (
                  <Link
                    to="/app/stories/$storyId/edit"
                    params={{ storyId: story.id }}
                    onClick={onClose}
                    className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius)] px-2.5 font-sans text-xs font-semibold transition-colors duration-150"
                    style={{
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      backgroundColor: "transparent",
                    }}
                  >
                    <PenLine className="size-3" />
                    Edit Story
                  </Link>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Close story viewer"
                  onClick={onClose}
                  className="h-7 w-7 rounded-[var(--radius)] transition-colors duration-150"
                  style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isPending ? (
                <div className="flex min-h-[50vh] items-center justify-center px-8">
                  <p className="font-sans text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Loading story...
                  </p>
                </div>
              ) : isError || !story ? (
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-8 text-center">
                  <div
                    className="flex size-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--muted)" }}
                  >
                    <BookOpen className="size-6" style={{ color: "var(--muted-foreground)" }} />
                  </div>
                  <div>
                    <p className="font-serif text-xl font-bold" style={{ color: "var(--foreground)" }}>
                      Story not found
                    </p>
                    <p className="mt-2 font-sans text-sm" style={{ color: "var(--muted-foreground)" }}>
                      This story may have been removed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-prose px-6 py-10 sm:px-10">
                  <header className="mb-10">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="h-px w-5" style={{ backgroundColor: "var(--accent-warm)" }} />
                      <span
                        className="rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.2em]"
                        style={{ backgroundColor: "oklch(0.93 0.025 60)", color: "var(--accent-warm)" }}
                      >
                        {story.category.name}
                      </span>
                    </div>

                    <h1
                      className="font-serif font-bold tracking-tight"
                      style={{
                        fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                        lineHeight: 1.1,
                        color: "var(--foreground)",
                      }}
                    >
                      {story.title}
                    </h1>

                    <p
                      className="mt-3 font-serif text-base italic leading-relaxed"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {story.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ color: "var(--muted-foreground)" }}>
                        <Calendar className="size-3.5" />
                        <span className="font-mono text-xs tabular-nums">{formatStoryDate(story.createdAt)}</span>
                      </div>

                      <span className="h-3.5 w-px" style={{ backgroundColor: "var(--border)" }} />

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleReaction("like")}
                        disabled={reactionMutation.isPending}
                        className="h-auto rounded-full px-2 py-0.5 transition-all duration-150"
                        style={{
                          backgroundColor: story.stats.myReaction === "like" ? "oklch(0.93 0.025 60)" : "transparent",
                          color: story.stats.myReaction === "like" ? "var(--accent-warm)" : "var(--muted-foreground)",
                        }}
                        aria-pressed={story.stats.myReaction === "like"}
                        aria-label={story.stats.myReaction === "like" ? "Unlike" : "Like story"}
                      >
                        <ThumbsUp
                          className="size-3.5"
                          style={{ fill: story.stats.myReaction === "like" ? "var(--accent-warm)" : "none" }}
                        />
                        <span className="font-mono text-xs tabular-nums">{story.stats.likes}</span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleReaction("dislike")}
                        disabled={reactionMutation.isPending}
                        className="h-auto rounded-full px-2 py-0.5 transition-all duration-150"
                        style={{
                          color: story.stats.myReaction === "dislike" ? "var(--destructive)" : "var(--muted-foreground)",
                        }}
                        aria-pressed={story.stats.myReaction === "dislike"}
                        aria-label={story.stats.myReaction === "dislike" ? "Remove dislike" : "Dislike story"}
                      >
                        <ThumbsDown className="size-3.5" />
                        <span className="font-mono text-xs tabular-nums">{story.stats.dislikes}</span>
                      </Button>

                      <span className="h-3.5 w-px" style={{ backgroundColor: "var(--border)" }} />

                      <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ color: "var(--muted-foreground)" }}>
                        <MessageCircle className="size-3.5" />
                        <span className="font-mono text-xs tabular-nums">{story.stats.comments}</span>
                      </div>

                      <span className="h-3.5 w-px" style={{ backgroundColor: "var(--border)" }} />

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleSave}
                        disabled={saveMutation.isPending}
                        className="h-auto rounded-full px-2 py-0.5 font-sans text-xs transition-all duration-150"
                        style={{
                          backgroundColor: story.stats.isSaved ? "oklch(0.93 0.025 60)" : "transparent",
                          color: story.stats.isSaved ? "var(--accent-warm)" : "var(--muted-foreground)",
                        }}
                        aria-pressed={story.stats.isSaved}
                        aria-label={story.stats.isSaved ? "Remove from saved" : "Save for later"}
                      >
                        <Bookmark
                          className="size-3.5"
                          style={{ fill: story.stats.isSaved ? "var(--accent-warm)" : "none" }}
                        />
                        {story.stats.isSaved ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </header>

                  {story.coverImageUrl ? (
                    <div className="mb-10 overflow-hidden rounded-[var(--radius)] border" style={{ borderColor: "var(--border)" }}>
                      <img
                        src={story.coverImageUrl}
                        alt={story.title}
                        className="h-44 w-full object-cover sm:h-56"
                      />
                    </div>
                  ) : (
                    <div
                      className="mb-10 flex h-44 items-center justify-center rounded-[var(--radius)] sm:h-56"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.93 0.025 60), oklch(0.87 0.045 55))",
                      }}
                    >
                      <BookOpen className="size-9" style={{ color: "var(--accent-warm)", opacity: 0.4 }} />
                    </div>
                  )}

                  <div className="mb-10 h-px w-full" style={{ backgroundColor: "var(--border)" }} />
                  {renderStoryContent(story.content)}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
