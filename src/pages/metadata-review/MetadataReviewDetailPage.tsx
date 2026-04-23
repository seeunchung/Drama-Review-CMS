import { useParams, useNavigate } from "react-router-dom";
import { ProjectHeader } from "@/components/layout";
import { useBatchDetail } from "@/network/hooks/use-review";
import { projectPathMap } from "@/app/paths";
import "./styles.css";

function MetadataReviewDetailPage() {
    const { batchId } = useParams<{ batchId: string }>();
    const navigate = useNavigate();
    const { batch, episodes, isLoading, error, updateStatus } = useBatchDetail(batchId);

    if (isLoading) return <div className="loading-state">데이터를 불러오는 중...</div>;
    if (error) return <div className="error-state">오류가 발생했습니다: {error.message}</div>;
    if (!batch) return <div className="error-state">해당 데이터를 찾을 수 없습니다.</div>;

    const handleStatusChange = async (status: "completed" | "failed") => {
        const confirmMsg = status === "completed" 
            ? "승인하시겠습니까? 승인 시 리뷰 사이트에 등록됩니다." 
            : "승인을 거절하시겠습니까?";
        
        if (window.confirm(confirmMsg)) {
            const result = await updateStatus(status);
            if (result?.success) {
                alert("처리되었습니다.");
                navigate(projectPathMap["metadata-review"]);
            }
        }
    };

    return (
        <main className="project-page review-detail-page">
            <ProjectHeader
                title={`Review: ${batch.drama_title}`}
                description={`${batch.file_name}을(를) 통해 업로드된 메타데이터를 검토합니다.`}
                tags={["상세 검토", batch.status.toUpperCase()]}
            />

            <div className="detail-toolbar panel">
                <div className="status-info">
                    현재 상태: <span className={`status-badge is-${batch.status}`}>{batch.status}</span>
                </div>
                <div className="action-group">
                    <button 
                        className="btn-outline" 
                        onClick={() => navigate(projectPathMap["metadata-review"])}
                    >
                        목록으로
                    </button>
                    <button 
                        className="btn-danger" 
                        disabled={batch.status === "failed"}
                        onClick={() => handleStatusChange("failed")}
                    >
                        승인 거절
                    </button>
                    <button 
                        className="btn-primary" 
                        disabled={batch.status === "completed"}
                        onClick={() => handleStatusChange("completed")}
                    >
                        최종 승인
                    </button>
                </div>
            </div>

            <section className="detail-content panel">
                {/* 확장 포인트: 향후 포스터 업로드 기능이 들어갈 자리 */}
                <div className="expansion-placeholder">
                    <p>📸 드라마 포스터 및 에셋 관리 섹션 (추가 예정)</p>
                </div>

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
                                    <td className="cell-summary">{ep.summary}</td>
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
