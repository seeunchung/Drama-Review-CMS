import { useMemo, useState } from "react";
import { ProjectHeader } from "@/components/layout";

// 입력 중, 변경 감지, 저장 가능 상태를 빠르게 전환해 본다.
type ReviewMode = "draft" | "changed" | "ready";
type ReviewTab = "기본정보" | "출연진/제작" | "작품소개";

const modeLabelMap = {
    draft: "초안 작성",
    changed: "수정 감지",
    ready: "승인 가능",
} as const;

const tabList: ReviewTab[] = ["기본정보", "출연진/제작", "작품소개"];

// 중드 마스터 데이터 검토 워크스페이스
function MetadataReviewPage() {
    const [mode, setMode] = useState<ReviewMode>("changed");
    const [activeTab, setActiveTab] = useState<ReviewTab>("기본정보");

    // 상태마다 변경 필드와 저장 가능 여부를 다르게 보여준다.
    const summary = useMemo(() => {
        if (mode === "draft") {
            return {
                saveLabel: "임시 저장",
                saveEnabled: false,
                changedFields: [],
                attachments: ["절요_포스터_가안.jpg"],
            };
        }

        if (mode === "ready") {
            return {
                saveLabel: "최종 승인",
                saveEnabled: true,
                changedFields: ["작품명", "장르 분류", "주연 배우"],
                attachments: ["절요_공식포스터.png", "메인예고편_최종.mp4"],
            };
        }

        return {
            saveLabel: "변경 검토",
            saveEnabled: false,
            changedFields: ["작품명", "포스터 이미지"],
            attachments: ["절요_수정포스터.jpg"],
        };
    }, [mode]);

    // 하단 테이블은 현재 모드에 맞는 행 상태만 단순하게 표현한다.
    const rowStatus =
        mode === "ready"
            ? ["정상", "정상", "정상"]
            : mode === "changed"
              ? ["변경", "대기", "대기"]
              : ["대기", "대기", "대기"];

    return (
        <main className="project-page">
            <ProjectHeader
                title="Drama Metadata Review"
                description="신규 중국 드라마 '절요(Zhe Yao)'의 마스터 메타데이터와 미디어 자산을 검토하고 최종 승인합니다."
                tags={["마스터 데이터", "변경 감지", "중드 승인", "운영 워크플로우"]}
            />

            <div className="screen-toolbar panel">
                <div className="screen-mode-group">
                    {(["draft", "changed", "ready"] as ReviewMode[]).map(
                        (item) => (
                            <button
                                className={mode === item ? "is-active" : ""}
                                key={item}
                                type="button"
                                onClick={() => setMode(item)}
                            >
                                {modeLabelMap[item]}
                            </button>
                        ),
                    )}
                </div>
                <span className="screen-toolbar-status">
                    현재 상태: {modeLabelMap[mode]}
                </span>
            </div>

            <section className="project-screen panel">
                <div className="workspace-tabs">
                    {tabList.map((tab) => (
                        <button
                            className={activeTab === tab ? "is-active" : ""}
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="review-layout">
                    <div className="review-form-card">
                        <div className="form-row">
                            <span>콘텐츠 ID</span>
                            <strong>CDRAMA-MOV-2024-0081</strong>
                        </div>
                        <div
                            className={`form-row${summary.changedFields.includes("작품명") ? " is-changed" : ""}`}
                        >
                            <span>작품명</span>
                            <strong>절요 (Zhe Yao)</strong>
                        </div>
                        <div className="form-row">
                            <span>장르</span>
                            <strong>고장극 / 로맨스 / 정극</strong>
                        </div>
                        <div
                            className={`form-row${summary.changedFields.includes("장르 분류") ? " is-changed" : ""}`}
                        >
                            <span>장르 분류</span>
                            <strong>
                                {mode === "ready" ? "언정소설 원작" : "검토 중"}
                            </strong>
                        </div>
                        <div className="form-row">
                            <span>활성 탭</span>
                            <strong>{activeTab}</strong>
                        </div>
                    </div>

                    <aside className="review-side-panel">
                        <div className="review-side-box">
                            <span>공식 미디어 자산</span>
                            <ul className="attachment-list">
                                {summary.attachments.map((file) => (
                                    <li key={file}>{file}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="review-side-box">
                            <span>변경 감지 필드</span>
                            <div className="change-chip-list">
                                {summary.changedFields.length === 0 ? (
                                    <span className="change-chip is-muted">
                                        변경 사항 없음
                                    </span>
                                ) : (
                                    summary.changedFields.map((field) => (
                                        <span
                                            className="change-chip"
                                            key={field}
                                        >
                                            {field}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </aside>
                </div>

                <div className="review-table-wrap">
                    <table className="review-table">
                        <thead>
                            <tr>
                                <th>검토 항목</th>
                                <th>현재 등록값</th>
                                <th>검증 상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {["작품 기본 정보", "주연진(송조아, 류우녕)", "원본/자막 영상"].map(
                                (label, index) => (
                                    <tr key={label}>
                                        <td>{label}</td>
                                        <td>
                                            {index === 0
                                                ? "입력 완료"
                                                : index === 1
                                                  ? "변경 사항 있음"
                                                  : "미디어 확인 중"}
                                        </td>
                                        <td>{rowStatus[index]}</td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="save-dock">
                    <div>
                        <strong>
                            {summary.changedFields.length}건의 마스터 데이터 수정됨
                        </strong>
                        <span>첨부 미디어 {summary.attachments.length}건</span>
                    </div>
                    <button disabled={!summary.saveEnabled} type="button">
                        {summary.saveLabel}
                    </button>
                </div>
            </section>
        </main>
    );
}

export { MetadataReviewPage };
