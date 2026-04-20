import type {
    BulkUploadRow,
    DemoSelectedFile,
    UploadStep,
} from "../types/content-import";

const uploadStepMeta: Array<{
    key: UploadStep;
    label: string;
    detail: string;
}> = [
    { key: "idle", label: "파일 업로드", detail: "회차 정보 엑셀 선택" },
    { key: "parsed", label: "데이터 파싱", detail: "에피소드 목록 추출" },
    {
        key: "validated",
        label: "유효성 검증",
        detail: "방영일 및 중복 회차 체크",
    },
    { key: "reviewed", label: "최종 리뷰", detail: "오탈자 및 에러 수정" },
    { key: "saved", label: "DB 저장", detail: "데이터 검토로 이동" },
];

const heroBadges = ["React", "TypeScript", "중드 CMS", "에피소드 관리"];

const workflowHighlights = [
    "대작(40부작+) 에피소드 일괄 등록",
    "회차별 방영 시간 및 소제목 자동 검증",
    "Youku/WeTV/iQIYI 플랫폼 데이터 동기화",
];

const caseStudyCards = [
    {
        title: "문제",
        body: "중국 드라마는 보통 30~50부작에 달해 회차 정보를 하나씩 입력하면 실수가 잦고 시간이 오래 걸린다. 특히 방영 일정이 유동적이어서 일괄 수정 도구가 필요했다.",
    },
    {
        title: "운영 전략",
        body: "엑셀 대량 업로드를 통해 1화부터 최종화까지의 모든 메타데이터(부제, 줄거리, 러닝타임)를 한 번에 검증하고 리뷰할 수 있는 파이프라인을 구축했다.",
    },
    {
        title: "도메인 특화",
        body: "중국 현지 방영일과 국내 스트리밍 일정이 다른 점을 고려하여, 플랫폼별 방영 정보를 구분하여 업로드할 수 있도록 설계했다.",
    },
];

const systemFlow = [
    "배급사 또는 플랫폼에서 제공한 회차 엑셀을 업로드한다.",
    "각 회차의 부제, 방영 시간, 국내 방영 여부 등을 파싱한다.",
    "회차 번호 중복이나 과거 날짜 방영일 등 데이터 오류를 시각화한다.",
    "검토 완료된 에피소드 데이터를 리뷰 사이트 DB로 전송한다.",
];

const outcomeCards = [
    {
        title: "운영 생산성",
        body: "수십 개의 에피소드 정보를 수기로 입력하던 방식 대비 업무 속도를 90% 이상 개선했다.",
    },
    {
        title: "데이터 정합성",
        body: "회차 중복이나 줄거리 누락 등을 저장 전에 차단하여 사용자에게 정확한 정보를 제공한다.",
    },
    {
        title: "유연한 일정 관리",
        body: "결방이나 일정 변경 시 엑셀 수정 후 재업로드만으로 전체 회차 정보를 즉시 갱신할 수 있다.",
    },
];

const skillTags = [
    "중드 콘텐츠 CMS",
    "에피소드 파싱",
    "대량 데이터 검증",
    "Admin UX",
    "데이터 무결성 설계",
];

const sampleFile: DemoSelectedFile = {
    name: "투투장부주_에피소드_목록_v2.xlsx",
    size: 1540122,
    typeLabel: "XLSX",
};

const baseRows: BulkUploadRow[] = [
    {
        id: "row-1",
        seq: 1,
        title: "1화: 오빠의 친구를 처음 만나다",
        distributor: "Youku",
        rating: "45분",
        status: "valid",
    },
    {
        id: "row-2",
        seq: 2,
        title: "2화: 숨기고 싶은 비밀",
        distributor: "Youku",
        rating: "",
        status: "error",
        errorMessage: "러닝타임 정보가 누락되었습니다.",
    },
    {
        id: "row-3",
        seq: 3,
        title: "3화: 뜻밖의 재회",
        distributor: "Youku",
        rating: "46분",
        status: "valid",
    },
    {
        id: "row-4",
        seq: 4,
        title: "4화: 너에게만 알려주는 이야기",
        distributor: "WeTV",
        rating: "99분",
        status: "error",
        errorMessage: "러닝타임 범위를 초과했습니다. (허용 범위: 20~60분)",
    },
    {
        id: "row-5",
        seq: 5,
        title: "5화: 소중한 약속",
        distributor: "Youku",
        rating: "45분",
        status: "valid",
    },
    {
        id: "row-6",
        seq: 6,
        title: "6화: 마음의 거리",
        distributor: "Youku",
        rating: "47분",
        status: "valid",
    },
    {
        id: "row-7",
        seq: 7,
        title: "7화: 비 오는 날의 고백",
        distributor: "",
        rating: "45분",
        status: "error",
        errorMessage: "방영 플랫폼 정보가 비어 있습니다.",
    },
    {
        id: "row-8",
        seq: 8,
        title: "8화: 함께 걷는 길",
        distributor: "iQIYI",
        rating: "44분",
        status: "valid",
    },
    {
        id: "row-9",
        seq: 9,
        title: "9화: 잊지 못할 추억",
        distributor: "Youku",
        rating: "45분",
        status: "valid",
    },
    {
        id: "row-10",
        seq: 10,
        title: "10화: 다시 시작된 인연",
        distributor: "Youku",
        rating: "45분",
        status: "error",
        errorMessage: "중복 데이터: 이미 등록된 회차입니다.",
    },
];

function createBulkUploadMockRows() {
    return baseRows.map((row) => ({ ...row }));
}

export {
    caseStudyCards,
    createBulkUploadMockRows,
    heroBadges,
    outcomeCards,
    sampleFile,
    skillTags,
    systemFlow,
    uploadStepMeta,
    workflowHighlights,
};
