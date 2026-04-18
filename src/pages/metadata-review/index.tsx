import { useMemo, useState } from "react";
import { ProjectHeader } from "../../components/layout/project-header";

// 입력 중, 변경 감지, 저장 가능 상태를 빠르게 전환해 본다.
type ReviewMode = "draft" | "changed" | "ready";
type ReviewTab = "기본정보" | "출연/제작" | "시놉시스";

const modeLabelMap = {
    draft: "초안 작성",
    changed: "수정 감지",
    ready: "승인 가능",
} as const;

const tabList: ReviewTab[] = ["기본정보", "출연/제작", "시놉시스"];

// 영화 메타데이터 검토 워크스페이스
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
                attachments: ["포스터_초안.jpg"],
            };
        }

        if (mode === "ready") {
            return {
                saveLabel: "최종 승인",
                saveEnabled: true,
                changedFields: ["콘텐츠 제목", "관람 등급", "출연진 정보"],
                attachments: ["포스터_최종.png", "예고편_v1.mp4"],
            };
        }

        return {
            saveLabel: "변경 검토",
            saveEnabled: false,
            changedFields: ["콘텐츠 제목", "포스터 이미지"],
            attachments: ["포스터_수정본.jpg"],
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
                title="Metadata Review Workspace"
                description="영화/드라마 메타데이터의 변경 사항을 감지하고 운영자가 최종 승인하는 워크플로우"
                tags={["운영자 리뷰", "변경 감지", "콘텐츠 승인", "CMS 레이아웃"]}
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
                    현재 워크플로우: {modeLabelMap[mode]}
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
                            <strong>CID-MOV-2026-0012</strong>
                        </div>
                        <div
                            className={`form-row${summary.changedFields.includes("콘텐츠 제목") ? " is-changed" : ""}`}
                        >
                            <span>콘텐츠 제목</span>
                            <strong>오징어 게임 시즌 2</strong>
                        </div>
                        <div className="form-row">
                            <span>장르</span>
                            <strong>스릴러 / 드라마</strong>
                        </div>
                        <div
                            className={`form-row${summary.changedFields.includes("관람 등급") ? " is-changed" : ""}`}
                        >
                            <span>관람 등급</span>
                            <strong>
                                {mode === "ready" ? "19세 이용가" : "검토 중"}
                            </strong>
                        </div>
                        <div className="form-row">
                            <span>활성 탭</span>
                            <strong>{activeTab}</strong>
                        </div>
                    </div>

                    <aside className="review-side-panel">
                        <div className="review-side-box">
                            <span>미디어 자산</span>
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
                                        변경 없음
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
                                <th>상태 정보</th>
                                <th>승인 여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {["기본 메타", "출연진/스태프", "자막/영상파일"].map(
                                (label, index) => (
                                    <tr key={label}>
                                        <td>{label}</td>
                                        <td>
                                            {index === 0
                                                ? "검증 완료"
                                                : index === 1
                                                  ? "변경 사항 있음"
                                                  : "파일 대조중"}
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
                            {summary.changedFields.length}건의 데이터 변경 감지
                        </strong>
                        <span>미디어 첨부 {summary.attachments.length}건</span>
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
