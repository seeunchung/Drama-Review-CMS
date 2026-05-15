import { ROUTES } from "./paths";

export type ProjectRouteId = "content-import" | "application-review" | "metadata-review" | "review-curation";
export type ProjectPath = (typeof ROUTES)[ProjectRouteId];

// 홈 카드와 상단 네비가 공유하는 운영 업무 메타 정보다.
interface AdminTask {
    id: ProjectRouteId;
    title: string;
    navLabel: string; // 상단 네비게이션에 표시될 짧은 이름
    description: string;
    path: ProjectPath;
    icon: string; // 업무를 상징하는 이모지 아이콘
    tags: string[]; // 페이지 헤더에 표시될 태그 목록
}

export const ADMIN_TASKS: AdminTask[] = [
    {
        id: "application-review",
        title: "드라마 신청 관리",
        navLabel: "드라마 신청관리",
        description: "사용자가 신청한 드라마 메타데이터 검토 및 승인 이관",
        path: ROUTES["application-review"],
        icon: "📝",
        tags: ["신청 검토", "데이터 이관"],
    },
    {
        id: "content-import",
        title: "콘텐츠 등록",
        navLabel: "콘텐츠 등록",
        description: "중국 드라마 메타데이터 엑셀 등록 및 1차 검수",
        path: ROUTES["content-import"],
        icon: "📂",
        tags: ["업로드", "엑셀 파싱", "운영 입력"],
    },
    {
        id: "metadata-review",
        title: "메타데이터 검수",
        navLabel: "메타데이터 검수",
        description: "업로드된 드라마 회차 정보를 검수하고 승인 상태를 관리",
        path: ROUTES["metadata-review"],
        icon: "🎬",
        tags: ["운영 검수", "드라마 승인", "상세 검수"],
    },
    {
        id: "review-curation",
        title: "리뷰 큐레이션",
        navLabel: "리뷰 큐레이션",
        description: "회차별 댓글을 검토하고 스포일러·베스트 리뷰를 관리",
        path: ROUTES["review-curation"],
        icon: "🎯",
        tags: ["큐레이션", "리뷰 관리", "운영 후처리"],
    },
];

// 드라마 업로드 및 검토 상태값 공통 매핑 (검토 워크플로우용)
export const STATUS_LABELS: Record<string, string> = {
    pending: "검토 대기",
    completed: "승인 완료",
    failed: "승인 거절",
};

// 엑셀 파싱 및 업로드 상태값 공통 매핑 (업로드 프로세스용)
export const UPLOAD_STATUS_LABELS: Record<string, string> = {
    valid: "정상",
    error: "오류",
    uploaded: "업로드 완료",
};
