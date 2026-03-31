export type StoryReaction = "like" | "dislike";

export type StoryCategory = {
  id: string;
  name: string;
  slug: string;
};

export type StoryMark = {
  type: string;
  attrs?: Record<string, {}>;
};

export type StoryContentNode = {
  type: string;
  text?: string;
  attrs?: Record<string, {}>;
  marks?: StoryMark[];
  content?: StoryContentNode[];
};

export type StoryContent = {
  type: "doc";
  content: StoryContentNode[];
};

export type StoryStats = {
  likes: number;
  dislikes: number;
  comments: number;
  saves: number;
  myReaction: StoryReaction | null;
  isSaved: boolean;
};

export type StoryListItem = {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  content: StoryContent;
  coverImageUrl: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  category: StoryCategory;
  stats?: StoryStats;
};

export type ReadLaterStoryItem = {
  storyId: string;
  savedAt: string;
  story: StoryListItem;
};

export type StoryComment = {
  id: string;
  storyId: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  canEdit: boolean;
  canDelete: boolean;
};

export function formatStoryDate(value: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
