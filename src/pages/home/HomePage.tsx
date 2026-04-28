import { Link } from "react-router-dom";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from "recharts";
import { ADMIN_TASKS } from "@/app/project-meta";
import { useHomeData } from "@/network/hooks/use-home";
import { debugApi } from "@/network/api/debug";
import { useToastStore } from "@/app/store/use-toast-store";
import { useModalStore } from "@/app/store/use-modal-store";

// 시간을 사람이 읽기 좋은 형식으로 변환
function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return date.toLocaleDateString();
}

// 대시보드 상단에 노출할 통계 위젯
function StatWidget({
    label,
    value,
    trend,
    color,
    isLoading,
}: {
    label: string;
    value: string | number;
    trend: string;
    color?: string;
    isLoading?: boolean;
}) {
    return (
        <div className="stat-widget panel">
            <span className="stat-label">{label}</span>
            <div className="stat-value-group">
                <strong style={{ color: color || "var(--ink-strong)" }}>
                    {isLoading ? "..." : value.toLocaleString()}
                </strong>
                <span className="stat-trend">{trend}</span>
            </div>
        </div>
    );
}

// 중드 리뷰 CMS 대시보드
function HomePage() {
    const { activities, chartData, reviewCounts, isLoading, refresh } = useHomeData();
    const toast = useToastStore();
    const { confirm } = useModalStore();

    const handleSeedData = async () => {
        const isConfirmed = await confirm("기존 데이터를 모두 삭제하고 테스트용 데이터를 다시 생성하시겠습니까? (정합성 보장 로직 적용)");
        if (!isConfirmed) return;

        try {
            toast.info("데이터 시딩 중...");
            await debugApi.seedAllData();
            toast.success("데이터 시딩 및 정합성 검증이 완료되었습니다.");
            refresh(); 
        } catch (error: any) {
            toast.error(`시딩 실패: ${error.message}`);
        }
    };

    const COLORS = ["var(--brand-red)", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

    return (
        <main className="dashboard-page">
            <section className="dashboard-hero">
                <div className="dashboard-title-group">
                    <span className="dashboard-kicker">
                        C-Drama Review Admin
                    </span>
                    <h1>중국드라마 리뷰 운영 시스템</h1>
                    <p>
                        중국 드라마 콘텐츠 등록, 회차 관리 및 팬 리뷰 플랫폼
                        데이터를 관리합니다.
                    </p>
                </div>
                <div className="dashboard-actions">
                    <button 
                        onClick={handleSeedData} 
                        className="btn-outline" 
                        style={{ marginRight: '12px' }}
                    >
                        테스트 데이터 시딩
                    </button>
                    <Link to="/content-import" className="quick-action-button">
                        신규 시리즈 에피소드 등록
                    </Link>
                </div>
            </section>

            <section className="dashboard-stats-grid">
                <StatWidget
                    label="이번 주 신작 등록"
                    value={reviewCounts.weekly}
                    trend="+신규"
                    color="var(--accent)"
                    isLoading={isLoading}
                />
                <StatWidget
                    label="검토 대기 드라마"
                    value={reviewCounts.pending}
                    trend="건수"
                    color="var(--status-pending)"
                    isLoading={isLoading}
                />
                <StatWidget
                    label="누적 리뷰 수"
                    value={reviewCounts.total}
                    trend="건"
                    color="var(--status-valid)"
                    isLoading={isLoading}
                />
                <StatWidget
                    label="오늘 유입 리뷰"
                    value={reviewCounts.today}
                    trend="건"
                    color="var(--brand-red)"
                    isLoading={isLoading}
                />
            </section>

            <section className="dashboard-chart-section panel">
                <div className="panel-header">
                    <h3>실시간 드라마 인기 지표 (리뷰 수 Top 5)</h3>
                    <p>승인 완료된 드라마 중 유저 리뷰가 가장 많이 달린 순위입니다.</p>
                </div>
                <div className="chart-container">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={150}
                                    tick={{ fill: 'var(--ink-soft)' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--surface-1)', 
                                        border: '1px solid var(--line-soft)',
                                        borderRadius: '12px',
                                        color: 'var(--ink-strong)'
                                    }}
                                    itemStyle={{ color: 'var(--accent)' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                                    {chartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-chart-state">
                            <p>표시할 데이터가 없습니다. 드라마를 승인하거나 리뷰 데이터를 생성해주세요.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="dashboard-content-grid">
                <div className="dashboard-main-panel panel">
                    <div className="panel-header">
                        <h3>운영 업무 큐</h3>
                        <p>오늘 처리해야 할 콘텐츠 운영 태스크입니다.</p>
                    </div>
                    <div className="dashboard-menu-list">
                        {ADMIN_TASKS.map((project) => (
                            <Link
                                key={project.id}
                                to={project.path}
                                className="dashboard-menu-item"
                            >
                                <div className="menu-icon-box">
                                    {project.icon}
                                </div>
                                <div className="menu-copy">
                                    <strong>{project.title}</strong>
                                    <p>{project.description}</p>
                                </div>
                                <div className="menu-arrow">→</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <aside className="dashboard-side-panel panel">
                    <div className="panel-header">
                        <h3>최근 업데이트 내역</h3>
                    </div>
                    <ul className="activity-list">
                        {isLoading ? (
                            <li className="activity-loading">
                                데이터를 불러오는 중...
                            </li>
                        ) : activities && activities.length > 0 ? (
                            activities.map((activity) => (
                                <li key={activity.id}>
                                    <span className="activity-time">
                                        {formatTime(activity.created_at)}
                                    </span>
                                    <p>{activity.message}</p>
                                </li>
                            ))
                        ) : (
                            <li className="activity-empty">
                                최근 활동 내역이 없습니다.
                            </li>
                        )}
                    </ul>
                </aside>
            </section>
        </main>
    );
}

export { HomePage };
