export type Notice = {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "low" | "medium" | "high";
};

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  location?: string;
};

export type Sponsor = {
  id: string;
  name: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  logo: string;
  website?: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  date: string;
  duration?: string;
};

export type Candidate = {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  category: "mr" | "miss";
  phone: string;
  department: string;
  bio: string | null;
  image_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

export type WordleWord = {
  id: string;
  word: string;
  created_by: string | null;
  created_at: string;
};

export type CandidateFormData = {
  full_name: string;
  category: "mr" | "miss";
  phone: string;
  department: string;
  bio?: string;
  image_url?: string;
};
