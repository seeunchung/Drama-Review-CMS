import { ROUTES } from "./paths";

export type ProjectRouteId = "content-import" | "metadata-review" | "review-curation";
export type ProjectPath = (typeof ROUTES)[ProjectRouteId];

// 홈 카드와 상단 네비가 공유하는 운영 업무 메타 정보다.
interface AdminTask {
    id: ProjectRouteId;
    title: string;
    description: string;
    path: ProjectPath;
}

export const ADMIN_TASKS: AdminTask[] = [
    {
        id: "content-import",
        title: "콘텐츠 등록",
        description: "드라마 메타데이터 엑셀 대량 등록 및 검토",
        path: ROUTES["content-import"],
    },
    {
        id: "metadata-review",
        title: "메타데이터 검토",
        description: "등록된 영상 콘텐츠의 상세 정보 교정 및 승인",
        path: ROUTES["metadata-review"],
    },
    {
        id: "review-curation",
        title: "리뷰 큐레이션",
        description: "드라마 회차별 댓글 관리 및 베스트 리뷰 선정",
        path: ROUTES["review-curation"],
    },
];
