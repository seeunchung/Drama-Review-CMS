export interface DramaComment {
  id: string | number;
  drama_id?: string;
  episode_no: number;
  user_nickname: string;
  content: string;
  rating: number;
  is_spoiler: boolean;
  is_best: boolean;
  created_at: string;
}

export interface ReviewStats {
  totalComments: number;
  spoilerReports: number;
  bestSelections: number;
}
