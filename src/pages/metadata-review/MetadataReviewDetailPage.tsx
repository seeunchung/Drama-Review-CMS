import { useParams, useNavigate } from "react-router-dom";
import { ProjectHeader } from "@/components/layout";
import { useBatchDetail } from "@/network/hooks";
import { useModalStore, useToastStore } from "@/app/store";
import { ROUTES } from "@/app/paths";
import { ADMIN_TASKS, STATUS_LABELS } from "@/app/project-meta";
import { PosterUploadSection } from "./components";
import "./styles.css";

function MetadataReviewDetailPage() {
    const { batchId } = useParams<{ batchId: string }>();
    const navigate = useNavigate();
    const {
        batch,
        episodes,
        isLoading,
        error,
        updateStatus,
        uploadPoster,
        isUploadingPoster,
        deleteBatch,
        isDeleting,
    } = useBatchDetail(batchId);

    const { confirm: modalConfirm } = useModalStore();
    const toast = useToastStore();

    // 메타데이터 정보 추출
    const pageMeta = ADMIN_TASKS.find((t) => t.id === "metadata-review");

    if (isLoading)
        return <div className="loading-state">데이터를 불러오는 중...</div>;
    if (error)
        return (
            <div className="error-state">
                오류가 발생했습니다: {error.message}
            </div>
        );
    if (!batch)
        return (
            <div className="error-state">해당 데이터를 찾을 수 없습니다.</div>
        );

    const handlePosterUpload = async (file: File) => {
        const result = await uploadPoster(file);
        if (result.success) {
            toast.success("포스터 이미지가 업로드되었습니다.");
        } else {
            toast.error(
                `업로드 실패: ${result.error?.message || "알 수 없는 오류"}`,
            );
        }
    };

    const handleStatusChange = async (status: "completed" | "failed") => {
        let confirmMsg =
            status === "completed"
                ? "승인하시겠습니까? 승인 시 리뷰 사이트에 등록됩니다."
                : "승인을 거절하시겠습니까?";

        // 포스터 미등록 상태에서 승인 시 경고 메시지 강화
        if (status === "completed" && !batch.poster_url) {
            confirmMsg =
                "포스터가 등록되지 않았습니다.\n포스터 없이 승인하여 리뷰 사이트에 등록하시겠습니까?";
        }

        const isConfirmed = await modalConfirm(confirmMsg);

        if (isConfirmed) {
            const result = await updateStatus(status);
            if (result?.success) {
                toast.success(
                    status === "completed"
                        ? "최종 승인되었습니다."
                        : "승인 거절 처리되었습니다.",
                );
                navigate(ROUTES["metadata-review"]);
            } else {
                toast.error("처리 중 오류가 발생했습니다.");
            }
        }
    };

    const handleDelete = async () => {
        const isConfirmed = await modalConfirm(
            `'${batch.drama_title}' 드라마의 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없으며, 에피소드 및 리뷰 데이터가 모두 삭제됩니다.`,
        );

        if (isConfirmed) {
            const result = await deleteBatch();
            if (result.success) {
                toast.success("드라마가 성공적으로 삭제되었습니다.");
                navigate(ROUTES["metadata-review"]);
            } else {
                toast.error(`삭제 실패: ${result.error?.message}`);
            }
        }
    };

    return (
        <main className="project-page review-detail-page">
            <ProjectHeader
                title={`${pageMeta?.title || "메타데이터 검수"}: ${batch.drama_title}`}
                description={`${batch.file_name}을(를) 통해 업로드된 회차 메타데이터를 검수합니다.`}
                tags={["상세 검수"]}
            />

            <div className="detail-toolbar panel">
                <div className="status-info">
                    현재 상태:{" "}
                    <span className={`status-badge is-${batch.status}`}>
                        {STATUS_LABELS[batch.status] || batch.status}
                    </span>
                </div>
                <div className="action-group">
                    <button
                        className="btn-outline"
                        disabled={isDeleting}
                        onClick={() => navigate(ROUTES["metadata-review"])}
                    >
                        목록으로
                    </button>
                    <button
                        className="btn-text is-danger"
                        disabled={isDeleting}
                        onClick={handleDelete}
                        style={{ marginRight: "auto" }}
                    >
                        {isDeleting ? "삭제 중..." : "드라마 삭제"}
                    </button>
                    <button
                        className="btn-danger"
                        disabled={batch.status === "failed" || isDeleting}
                        onClick={() => handleStatusChange("failed")}
                    >
                        승인 거절
                    </button>
                    <button
                        className="btn-primary"
                        disabled={batch.status === "completed" || isDeleting}
                        onClick={() => handleStatusChange("completed")}
                    >
                        최종 승인
                    </button>
                </div>
            </div>

            <section className="detail-content panel">
                <PosterUploadSection
                    posterUrl={batch.poster_url}
                    isUploading={isUploadingPoster}
                    onUpload={handlePosterUpload}
                    disabled={batch.status === "failed"}
                />

                <div className="review-table-wrap is-full">
                    <table className="review-table">
                        <thead>
                            <tr>
                                <th>순번</th>
                                <th>제목</th>
                                <th>플랫폼</th>
                                <th>등급</th>
                                <th>회차</th>
                                <th>부제목</th>
                                <th>러닝타임</th>
                                <th>줄거리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {episodes.map((ep) => (
                                <tr key={ep.id}>
                                    <td>{ep.seq}</td>
                                    <td className="cell-title">{ep.title}</td>
                                    <td>{ep.distributor}</td>
                                    <td>{ep.rating}</td>
                                    <td>{ep.episode}</td>
                                    <td>{ep.subtitle || "-"}</td>
                                    <td>{ep.running_time}</td>
                                    <td className="cell-summary">
                                        {ep.summary}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default MetadataReviewDetailPage;
