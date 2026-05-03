import type { UploadStep } from "@/pages/content-import/types/content-import";

export interface StepMeta {
    key: UploadStep;
    label: string;
    detail: string;
}

export const UPLOAD_STEPS: StepMeta[] = [
    { key: "idle", label: "파일 업로드", detail: "회차 정보 엑셀 선택" },
    { key: "parsed", label: "데이터 파싱", detail: "에피소드 목록 추출" },
    {
        key: "validated",
        label: "유효성 검증",
        detail: "중복 및 필수값 검증",
    },
    { key: "reviewed", label: "최종 리뷰", detail: "오탈자 및 에러 수정" },
    { key: "saved", label: "DB 저장", detail: "데이터 검토로 이동" },
];
