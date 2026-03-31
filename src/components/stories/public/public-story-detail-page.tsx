import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Calendar,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { renderStoryContent } from "../shared/render-story-content";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStoryWithCategory } from "#/server/story";
import { removeReadLater, saveReadLater } from "#/server/readLater";
import { toggleReaction } from "#/server/reaction";
import { formatStoryDate } from "#/types/story";
import { authClient } from "#/lib/auth-client";
import { PublicComments } from "./public-comments";
import { toast } from "sonner";

type StoryWithStats = Awaited<ReturnType<typeof getStoryWithCategory>>["data"];

function StoryNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-6">
      <div
        className="flex size-16 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--muted)" }}
      >
        <BookOpen className="size-7" style={{ color: "var(--muted-foreground)" }} />
      </div>
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Story not found
        </h2>
        <p className="mt-2 font-sans text-sm" style={{ color: "var(--muted-foreground)" }}>
          This story may have been moved or removed.
        </p>
      </div>
      <Link
        to="/stories"
        className="inline-flex items-center gap-2 font-sans text-sm font-semibold"
        style={{ color: "var(--accent-warm)" }}
      >
        <ArrowLeft className="size-3.5" />
        Back to all stories
      </Link>
    </div>
  );
}

function updateStoryCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  storyId: string,
  updater: (story: StoryWithStats) => StoryWithStats,
) {
  queryClient.setQueryData(["story", "public", storyId], (old: StoryWithStats | undefined) =>
    old ? updater(old) : old,
  );
  queryClient.setQueryData(["story", "sheet", storyId], (old: StoryWithStats | undefined) =>
    old ? updater(old) : old,
  );

  const updateList = (old: unknown) => {
    if (!old || typeof old !== "object") return old;
    const value = old as { stories?: StoryWithStats[] };
    if (!Array.isArray(value.stories)) return old;

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

export function PublicStoryDetailPage({ storyId }: { storyId: string }) {
  const queryClient = useQueryClient();
  const sessionQuery = authClient.useSession();
  const viewerUser = sessionQuery.data?.user;

  const { data, isPending, isError } = useQuery({
    queryKey: ["story", "public", storyId],
    queryFn: async () => {
      const res = await getStoryWithCategory({ data: { storyId } });
      return res.data;
    },
  });
  const story = data ?? null;

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
        "public",
        storyId,
      ]);

      if (!previous) return { previous };

      updateStoryCaches(queryClient, storyId, (current) => {
        const prevReaction = current.stats.myReaction;
        const nextReaction = prevReaction === reaction ? null : reaction;

        let nextLikes = current.stats.likes;
        let nextDislikes = current.stats.dislikes;

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
        queryClient.setQueryData(["story", "public", vars.storyId], context.previous);
      }
      toast.error("Failed to update reaction.");
    },
    onSettled: (_result, _error, vars) => {
      void queryClient.invalidateQueries({ queryKey: ["story", "public", vars.storyId] });
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
    onMutate: async ({ storyId, isSaved }: { storyId: string; isSaved: boolean }) => {
      const previous = queryClient.getQueryData<StoryWithStats>([
        "story",
        "public",
        storyId,
      ]);

      if (!previous) return { previous };

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
        queryClient.setQueryData(["story", "public", vars.storyId], context.previous);
      }
      toast.error("Failed to update your Read Later list.");
    },
    onSettled: (_result, _error, vars) => {
      void queryClient.invalidateQueries({ queryKey: ["story", "public", vars.storyId] });
      void queryClient.invalidateQueries({ queryKey: ["stories", "public"] });
      void queryClient.invalidateQueries({ queryKey: ["stories", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["read-later", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["read-later", "count", "me"] });
    },
  });

  function requireAuth() {
    window.location.assign("/sign-in");
  }

  function handleToggleReaction(nextReaction: "like" | "dislike") {
    if (!story) return;
    if (!viewerUser) {
      requireAuth();
      return;
    }

    reactionMutation.mutate({ storyId: story.id, reaction: nextReaction });
  }

  function handleToggleSaved() {
    if (!story) return;
    if (!viewerUser) {
      requireAuth();
      return;
    }

    saveMutation.mutate({ storyId: story.id, isSaved: story.stats.isSaved });
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="font-sans text-sm" style={{ color: "var(--muted-foreground)" }}>
          Loading story...
        </p>
      </div>
    );
  }

  if (isError || !story) return <StoryNotFound />;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <Link
          to="/stories"
          className="group inline-flex items-center gap-2 font-sans text-xs font-semibold transition-opacity duration-150 hover:opacity-70"
          style={{ color: "var(--muted-foreground)" }}
        >
          <ArrowLeft className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
          All stories
        </Link>
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-6" style={{ backgroundColor: "var(--accent-warm)" }} />
          <span
            className="rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ backgroundColor: "oklch(0.93 0.025 60)", color: "var(--accent-warm)" }}
          >
            {story.category.name}
          </span>
        </div>

        <h1
          className="font-serif font-bold tracking-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.08, color: "var(--foreground)" }}
        >
          {story.title}
        </h1>

        <p
          className="mt-4 font-serif text-lg italic leading-relaxed"
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
            aria-label={story.stats.myReaction === "like" ? "Unlike story" : "Like story"}
            aria-pressed={story.stats.myReaction === "like"}
          >
            <ThumbsUp className="size-3.5 transition-colors duration-150" style={{ fill: story.stats.myReaction === "like" ? "var(--accent-warm)" : "none" }} />
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
            aria-label={story.stats.myReaction === "dislike" ? "Remove dislike" : "Dislike story"}
            aria-pressed={story.stats.myReaction === "dislike"}
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
            onClick={handleToggleSaved}
            disabled={saveMutation.isPending}
            className="h-auto rounded-full px-2 py-0.5 font-sans text-xs transition-all duration-150"
            style={{
              backgroundColor: story.stats.isSaved ? "oklch(0.93 0.025 60)" : "transparent",
              color: story.stats.isSaved ? "var(--accent-warm)" : "var(--muted-foreground)",
            }}
            aria-label={story.stats.isSaved ? "Remove from saved" : "Save for later"}
            aria-pressed={story.stats.isSaved}
          >
            <Bookmark className="size-3.5 transition-colors duration-150" style={{ fill: story.stats.isSaved ? "var(--accent-warm)" : "none" }} />
            {story.stats.isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </motion.header>

      {story.coverImageUrl ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 overflow-hidden rounded-[var(--radius)] border"
          style={{ borderColor: "var(--border)" }}
        >
          <img
            src={story.coverImageUrl}
            alt={story.title}
            className="h-52 w-full object-cover sm:h-72"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 flex h-52 items-center justify-center rounded-[var(--radius)] sm:h-72"
          style={{ background: "linear-gradient(135deg, oklch(0.93 0.025 60), oklch(0.87 0.045 55))" }}
        >
          <BookOpen className="size-10" style={{ color: "var(--accent-warm)", opacity: 0.4 }} />
        </motion.div>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 h-px origin-left"
        style={{ backgroundColor: "var(--border)" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {renderStoryContent(story.content)}
      </motion.div>

      <PublicComments storyId={story.id} />
    </div>
  );
}
