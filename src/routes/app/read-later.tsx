import * as React from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AppContent } from "#/components/app/app-content";
import { ArrowRight, Bookmark, BookOpen, ChevronDown, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { StoryViewerSheet } from "#/components/stories/app/story-viewer-sheet";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReadLaterStories, removeReadLater } from "#/server/readLater";

export const Route = createFileRoute("/app/read-later")({
  component: ReadLaterPage,
});

type SortOrder = "newest" | "oldest";

const SORT_OPTIONS: Array<{ label: string; value: SortOrder }> = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
];

function formatSavedDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function formatShortMonth(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function ReadLaterCard({
  item,
  index,
  onRemove,
  onRead,
  isRemoving,
}: {
  item: Awaited<ReturnType<typeof getReadLaterStories>>["data"]["stories"][number];
  index: number;
  onRemove: (storyId: string) => void;
  onRead: (storyId: string) => void;
  isRemoving: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex items-start gap-4 px-5 py-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span
        className="pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
        style={{ backgroundColor: "var(--accent-warm)" }}
      />

      <div
        className="relative shrink-0 overflow-hidden rounded-[var(--radius)]"
        style={{ width: "52px", height: "72px" }}
      >
        {item.story.coverImageUrl ? (
          <img
            src={item.story.coverImageUrl}
            alt={item.story.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, oklch(0.93 0.025 60), oklch(0.87 0.045 55))",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="size-4" style={{ color: "var(--accent-warm)" }} />
            </div>
          </>
        )}
        <span
          className="absolute right-0.5 top-0.5 rounded-sm px-0.5 font-mono text-[7px] font-bold leading-tight tabular-nums"
          style={{
            backgroundColor: "var(--accent-warm)",
            color: "oklch(0.99 0 0)",
            letterSpacing: "0.03em",
          }}
        >
          {formatShortMonth(item.savedAt)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className="shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: "oklch(0.93 0.025 60)", color: "var(--accent-warm)" }}
          >
            {item.story.category.name}
          </span>
        </div>

        <Button
          type="button"
          variant="link"
          onClick={() => onRead(item.story.id)}
          className="h-auto p-0 text-left font-serif text-base font-semibold leading-snug tracking-tight text-[var(--foreground)] no-underline hover:text-[var(--accent-warm)] hover:no-underline"
        >
          {item.story.title}
        </Button>

        <p className="mt-1 line-clamp-2 font-sans text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {item.story.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs tabular-nums" style={{ color: "var(--muted-foreground)" }}>
            Saved {formatSavedDate(item.savedAt)}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(item.storyId)}
            disabled={isRemoving}
            className="h-7 gap-1.5 rounded-[var(--radius)] px-2.5 font-sans text-xs font-medium"
            style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
          >
            <Trash2 className="size-3" />
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[var(--radius)] px-8 py-20 text-center"
      style={{ backgroundColor: "oklch(0.16 0 0)" }}
    >
      <div className="relative z-10 flex flex-col items-center">
        <Bookmark className="mb-5 size-8" style={{ color: "var(--accent-warm)", opacity: 0.9 }} />
        <p className="font-serif text-xl italic leading-snug" style={{ color: "oklch(0.9 0 0)" }}>
          Your reading list is empty.
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: "oklch(0.6 0 0)" }}>
          Save stories you want to revisit and they will appear here.
        </p>
        <Link
          to="/app/stories"
          className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold transition-opacity duration-150 hover:opacity-70"
          style={{ color: "var(--accent-warm)" }}
        >
          Discover stories
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

function ReadLaterPage() {
  const queryClient = useQueryClient();
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("newest");
  const [viewingStoryId, setViewingStoryId] = React.useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["read-later", "me", sortOrder],
    queryFn: async () => {
      const res = await getReadLaterStories({
        data: { page: 1, limit: 100, sortBy: sortOrder },
      });
      return res.data;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (storyId: string) => {
      await removeReadLater({ data: { storyId } });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["read-later", "me"] }),
        queryClient.invalidateQueries({ queryKey: ["read-later", "count", "me"] }),
        queryClient.invalidateQueries({ queryKey: ["story"] }),
        queryClient.invalidateQueries({ queryKey: ["stories", "public"] }),
        queryClient.invalidateQueries({ queryKey: ["stories", "me"] }),
      ]);
    },
  });

  if (isPending) {
    return (
      <AppContent>
        <p className="font-sans text-sm" style={{ color: "var(--muted-foreground)" }}>
          Loading your saved stories...
        </p>
      </AppContent>
    );
  }

  if (isError || !data) {
    return (
      <AppContent>
        <p className="font-sans text-sm" style={{ color: "var(--destructive)" }}>
          Could not load your Read Later list.
        </p>
      </AppContent>
    );
  }

  const items = data.stories;
  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortOrder)?.label ?? "Newest First";

  return (
    <AppContent>
      <div className="relative mb-12 overflow-hidden">
        <div
          className="pointer-events-none absolute -right-4 -top-8 select-none font-serif leading-none"
          aria-hidden
          style={{
            fontSize: "clamp(11rem, 26vw, 20rem)",
            color: "currentColor",
            opacity: 0.04,
            WebkitTextStroke: "1px currentColor",
            lineHeight: 1,
          }}
        >
          R
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: "var(--accent-warm)" }} />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "var(--accent-warm)" }}>
            Read Later
          </span>
          <span className="h-px w-6 shrink-0" style={{ backgroundColor: "var(--accent-warm)" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold tracking-tight"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            color: "var(--foreground)",
            lineHeight: 1.05,
          }}
        >
          Saved
          <br />
          Stories.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-4 font-sans text-sm italic leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          {items.length} {items.length === 1 ? "story" : "stories"} waiting for you.
        </motion.p>
      </div>

      {items.length > 0 && (
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="font-sans text-sm" style={{ color: "var(--muted-foreground)" }}>
            {items.length} saved {items.length === 1 ? "story" : "stories"}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 justify-between px-3 font-sans text-sm font-normal"
                style={{ backgroundColor: "var(--background)", minWidth: "170px" }}
              >
                {currentSortLabel}
                <ChevronDown className="size-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[170px]">
              <DropdownMenuLabel className="font-sans text-xs uppercase tracking-wide">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setSortOrder(option.value)}
                  className="font-sans text-sm"
                  style={{
                    fontWeight: sortOrder === option.value ? "600" : undefined,
                    color: sortOrder === option.value ? "var(--accent-warm)" : undefined,
                  }}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {items.length > 0 ? (
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            backgroundColor: "var(--card)",
          }}
        >
          {items.map((item, index) => (
            <ReadLaterCard
              key={item.storyId}
              item={item}
              index={index}
              onRemove={(storyId) => removeMutation.mutate(storyId)}
              onRead={setViewingStoryId}
              isRemoving={removeMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <StoryViewerSheet storyId={viewingStoryId} onClose={() => setViewingStoryId(null)} />
    </AppContent>
  );
}
