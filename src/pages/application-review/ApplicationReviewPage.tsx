import { ProjectHeader } from "@/components/layout";
import { ADMIN_TASKS } from "@/app/project-meta";
import { useApplications } from "@/network/hooks/use-application";
import { Link, useNavigate } from "react-router-dom";
import { STATUS_LABELS } from "@/app/project-meta";
import "./styles.css";

function ApplicationReviewPage() {
    const navigate = useNavigate();
    const { data: applications, isLoading } = useApplications();
    const pageMeta = ADMIN_TASKS.find((t) => t.id === "application-review");

    return (
        <main className="application-review-page">
            <ProjectHeader
                title={pageMeta?.title || "사용자 신청 관리"}
                description={pageMeta?.description || "사용자가 신청한 드라마 정보를 검토하고 승인합니다."}
                tags={pageMeta?.tags || ["사용자 신청", "데이터 검토"]}
            />

            <section className="application-review-list-section panel fade-up">
                <div className="application-review-section-header">
                    <h2>신청 내역 ({applications?.length || 0})</h2>
                </div>

                <div className="application-review-table-wrap">
                    <table className="application-review-table">
                        <thead>
                            <tr>
                                <th>신청일</th>
                                <th>드라마 제목</th>
                                <th>OTT</th>
                                <th>관람등급</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="application-review-table-state"
                                    >
                                        데이터를 불러오는 중...
                                    </td>
                                </tr>
                            ) : applications?.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="application-review-table-state"
                                    >
                                        신청 내역이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                applications?.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="application-review-row"
                                    >
                                        <td onClick={() => navigate(`/application-review/${app.id}`)}>{new Date(app.created_at).toLocaleDateString()}</td>
                                        <td onClick={() => navigate(`/application-review/${app.id}`)}><strong>{app.title}</strong></td>
                                        <td onClick={() => navigate(`/application-review/${app.id}`)}>{app.ott}</td>
                                        <td onClick={() => navigate(`/application-review/${app.id}`)}>{app.rating}</td>
                                        <td onClick={() => navigate(`/application-review/${app.id}`)}>
                                            <span className={`status-badge status-${app.status}`}>
                                                {STATUS_LABELS[app.status]}
                                            </span>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/application-review/${app.id}`}
                                                className="application-review-detail-link"
                                            >
                                                상세보기
                                            </Link>
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

export default ApplicationReviewPage;
