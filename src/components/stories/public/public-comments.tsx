import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MessageCircle, Send, Pencil, Trash2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, getComments, updateComment } from "#/server/comment";
import { authClient } from "#/lib/auth-client";
import { formatStoryDate, type StoryComment } from "#/types/story";
import { toast } from "sonner";

function CommentCard({
  comment,
  index,
  isEditing,
  editValue,
  onEditValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  isBusy,
}: {
  comment: StoryComment;
  index: number;
  isEditing: boolean;
  editValue: string;
  onEditValue: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  isBusy: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4 py-5"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full font-sans text-sm font-bold"
        style={{ backgroundColor: "oklch(0.93 0.025 60)", color: "var(--accent-warm)" }}
      >
        {comment.authorName.charAt(0)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-sans text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {comment.authorName}
            </span>
            <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--muted-foreground)" }}>
              {formatStoryDate(comment.createdAt)}
            </span>
          </div>

          {(comment.canEdit || comment.canDelete) && (
            <div className="flex items-center gap-1">
              {comment.canEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={isEditing ? onCancelEdit : onStartEdit}
                  disabled={isBusy}
                  className="h-7 gap-1 px-2 font-sans text-xs"
                >
                  <Pencil className="size-3" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              )}
              {comment.canDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  disabled={isBusy}
                  className="h-7 gap-1 px-2 font-sans text-xs text-[var(--destructive)]"
                >
                  <Trash2 className="size-3" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editValue}
              onChange={(event) => onEditValue(event.target.value)}
              rows={3}
              className="resize-none px-3 py-2 font-sans text-sm leading-relaxed"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={onSaveEdit}
                disabled={isBusy || !editValue.trim()}
                className="h-8 px-3 text-xs"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1.5 font-sans text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
            {comment.content}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function PublicComments({ storyId }: { storyId: string }) {
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const viewerUser = session.data?.user;
  const [draft, setDraft] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const { data, isPending, isError } = useQuery({
    queryKey: ["comments", "story", storyId],
    queryFn: async () => {
      const res = await getComments({
        data: { storyId, page: 1, limit: 50, sortBy: "newest" },
      });
      return res.data;
    },
    staleTime: 5_000,
  });

  const refreshCommentViews = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["comments", "story", storyId] }),
      queryClient.invalidateQueries({ queryKey: ["story", "public", storyId] }),
      queryClient.invalidateQueries({ queryKey: ["story", "sheet", storyId] }),
      queryClient.invalidateQueries({ queryKey: ["stories", "public"] }),
      queryClient.invalidateQueries({ queryKey: ["stories", "me"] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      await createComment({ data: { storyId, content: draft.trim() } });
    },
    onSuccess: async () => {
      setDraft("");
      await refreshCommentViews();
    },
    onError: () => {
      toast.error("Failed to post comment.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      await updateComment({ data: { commentId, content: content.trim() } });
    },
    onSuccess: async () => {
      setEditingCommentId(null);
      setEditingContent("");
      await refreshCommentViews();
    },
    onError: () => {
      toast.error("Failed to update comment.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteComment({ data: { commentId } });
    },
    onSuccess: async () => {
      await refreshCommentViews();
    },
    onError: () => {
      toast.error("Failed to delete comment.");
    },
  });

  const comments = data?.comments ?? [];
  const isBusy =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  function handleStartEdit(comment: StoryComment) {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  }

  function handleSubmitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!viewerUser) {
      window.location.assign("/sign-in");
      return;
    }
    if (!draft.trim() || createMutation.isPending) return;
    createMutation.mutate();
  }

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
        <div className="flex items-center gap-2" style={{ color: "var(--accent-warm)" }}>
          <MessageCircle className="size-3" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </span>
        </div>
        <span className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
      </div>

      {viewerUser ? (
        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmitComment}>
          <div
            className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{ color: "var(--accent-warm)" }}
          >
            Leave a comment
          </div>

          <p className="font-sans text-xs" style={{ color: "var(--muted-foreground)" }}>
            Commenting as {viewerUser.name ?? "your account"}.
          </p>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="comment-body" className="font-sans text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
              Your thoughts
            </label>
            <Textarea
              id="comment-body"
              placeholder="What did this story make you feel?"
              rows={4}
              className="resize-none px-3 py-2 font-sans text-sm leading-relaxed"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={createMutation.isPending || !draft.trim()}
              className="h-9 gap-2 px-4 font-sans text-sm font-semibold transition-opacity duration-150 hover:opacity-85"
              style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
            >
              <Send className="size-3.5" />
              {createMutation.isPending ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-4 font-sans text-sm" style={{ color: "var(--muted-foreground)" }}>
          Want to join the conversation?{" "}
          <Link to="/sign-in" className="font-semibold underline underline-offset-2">
            Sign in
          </Link>{" "}
          to post a comment.
        </p>
      )}

      {isPending ? (
        <p className="py-8 text-center font-sans text-sm" style={{ color: "var(--muted-foreground)" }}>
          Loading comments...
        </p>
      ) : isError ? (
        <p className="py-8 text-center font-sans text-sm" style={{ color: "var(--destructive)" }}>
          Could not load comments.
        </p>
      ) : comments.length === 0 ? (
        <p className="py-8 text-center font-serif text-base italic" style={{ color: "var(--muted-foreground)" }}>
          No comments yet. Be the first to respond.
        </p>
      ) : (
        <div>
          {comments.map((comment, index) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              index={index}
              isEditing={editingCommentId === comment.id}
              editValue={editingCommentId === comment.id ? editingContent : ""}
              onEditValue={setEditingContent}
              onStartEdit={() => handleStartEdit(comment)}
              onCancelEdit={() => {
                setEditingCommentId(null);
                setEditingContent("");
              }}
              onSaveEdit={() =>
                updateMutation.mutate({
                  commentId: comment.id,
                  content: editingContent,
                })
              }
              onDelete={() => deleteMutation.mutate(comment.id)}
              isBusy={isBusy}
            />
          ))}
        </div>
      )}
    </section>
  );
}
