import { useNavigate } from "react-router-dom";
import { ProjectHeader } from "@/components/layout";
import { useBatches } from "@/network/hooks/use-review";
import { ROUTES } from "@/app/paths";
import "./styles.css";

function MetadataReviewPage() {
    const navigate = useNavigate();
    const { batches, isLoading, error } = useBatches();

    if (isLoading) return <div className="loading-state">목록을 불러오는 중...</div>;
    if (error) return <div className="error-state">오류가 발생했습니다: {error.message}</div>;

    const handleRowClick = (batchId: string) => {
        // 상세 페이지로 이동 (batchId 포함)
        const path = ROUTES["metadata-review-detail"].replace(":batchId", batchId);
        navigate(path);
    };

    return (
        <main className="project-page review-list-page">
            <ProjectHeader
                title="Metadata Review"
                description="대량 업로드된 드라마 메타데이터를 검토하고 승인하여 서비스에 반영합니다."
                tags={["운영 관리", "드라마 승인", "데이터 검토"]}
            />

            <section className="project-screen panel">
                <div className="list-header">
                    <h2>업로드 배치 목록 ({batches.length})</h2>
                    <p>드라마를 선택하여 상세 에피소드 정보를 확인하고 승인 처리를 진행하세요.</p>
                </div>

                <div className="batch-table-wrap">
                    <table className="review-table is-selectable">
                        <thead>
                            <tr>
                                <th>상태</th>
                                <th>드라마 제목</th>
                                <th>업로드 파일명</th>
                                <th>업로드 일시</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batches.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="empty-cell">업로드된 내역이 없습니다.</td>
                                </tr>
                            ) : (
                                batches.map((batch) => (
                                    <tr key={batch.id} onClick={() => handleRowClick(batch.id)}>
                                        <td>
                                            <span className={`status-badge is-${batch.status}`}>
                                                {batch.status === "pending" ? "검토 대기" : 
                                                 batch.status === "completed" ? "승인 완료" : "승인 거절"}
                                            </span>
                                        </td>
                                        <td className="cell-important">{batch.drama_title}</td>
                                        <td>{batch.file_name}</td>
                                        <td>{new Date(batch.created_at).toLocaleString()}</td>
                                        <td>
                                            <button className="btn-text">검토하기</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export { MetadataReviewPage };
