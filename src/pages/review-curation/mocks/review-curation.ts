import { DramaComment } from "../types/review-curation";

export const MOCK_COMMENTS: DramaComment[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  episode_no: Math.floor(i / 5) + 1,
  user_nickname: `User_${i + 1}`,
  content: i % 3 === 0 
    ? "이 드라마 진짜 대박이네요! 다음 화가 너무 기대됩니다. 연출이랑 연기가 미쳤어요." 
    : "스토리가 조금 루즈해지는 것 같은데... 그래도 배우들 보는 맛에 봅니다. [스포일러 포함] 사실 범인은 누구였습니다!",
  rating: Math.floor(Math.random() * 5) + 1,
  is_spoiler: i % 4 === 0,
  is_best: i % 10 === 0,
  created_at: new Date(Date.now() - i * 3600000).toISOString(),
}));

export const MOCK_STATS = {
  totalComments: 1240,
  spoilerReports: 42,
  bestSelections: 18,
};
