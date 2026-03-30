export type OverviewTimeframe = "7D" | "30D" | "90D";

export type OverviewKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
  delta?: string;
};

export type OverviewHealthMetric = {
  id: string;
  label: string;
  value: string;
  hint: string;
};

export type OverviewTrendPoint = {
  label: string;
  likes: number;
  comments: number;
  saves: number;
};

export type OverviewReactionSlice = {
  name: string;
  value: number;
  color: string;
};

export type OverviewCategoryPoint = {
  category: string;
  likes: number;
  comments: number;
  saves: number;
};

export type OverviewMonthlyPoint = {
  month: string;
  stories: number;
};

export type OverviewLeaderboardRow = {
  storyId: string;
  storyTitle: string;
  category: string;
  count: number;
  updatedAt: string;
};

export type OverviewLeaderboardGroup = {
  id: string;
  title: string;
  description: string;
  countLabel: string;
  rows: OverviewLeaderboardRow[];
};

export type OverviewRecentComment = {
  id: string;
  storyTitle: string;
  author: string;
  excerpt: string;
  createdAt: string;
};

export type OverviewRecentSave = {
  id: string;
  storyTitle: string;
  savedAt: string;
};

export type OverviewRecentEdit = {
  id: string;
  storyTitle: string;
  category: string;
  updatedAt: string;
};

export type OverviewBreakdownRow = {
  category: string;
  count: number;
};

export type OverviewBreakdownGroup = {
  id: string;
  title: string;
  description: string;
  rows: OverviewBreakdownRow[];
};
