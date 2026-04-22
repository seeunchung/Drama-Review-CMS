import { Link } from 'react-router-dom'
import { projectList } from '../../app/project-meta'
import { useHomeData } from './hooks/use-home-data'

// 시간을 사람이 읽기 좋은 형식으로 변환 (데모용)
function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
  return date.toLocaleDateString();
}

// 대시보드 상단에 노출할 통계 위젯
function StatWidget({ label, value, trend, color, isLoading }: { label: string, value: string | number, trend: string, color?: string, isLoading?: boolean }) {
  return (
    <div className="stat-widget panel">
      <span className="stat-label">{label}</span>
      <div className="stat-value-group">
        <strong style={{ color: color || 'var(--ink-strong)' }}>
          {isLoading ? '...' : value.toLocaleString()}
        </strong>
        <span className="stat-trend">{trend}</span>
      </div>
    </div>
  )
}

// 중드 리뷰 CMS 대시보드
function HomePage() {
  const { stats, activities, isLoading } = useHomeData();

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-title-group">
          <span className="dashboard-kicker">C-Drama Review Admin</span>
          <h1>중드 리뷰 운영 시스템</h1>
          <p>중국 드라마 콘텐츠 등록, 회차 관리 및 팬 리뷰 플랫폼 데이터를 관리합니다.</p>
        </div>
        <div className="dashboard-actions">
           <Link to="/content-import" className="quick-action-button">
             신규 시리즈 에피소드 등록
           </Link>
        </div>
      </section>

      <section className="dashboard-stats-grid">
        <StatWidget 
          label="이번 주 신작 등록" 
          value={stats?.weekly_new_series ?? 0} 
          trend="+신규" 
          color="var(--accent)" 
          isLoading={isLoading}
        />
        <StatWidget 
          label="회차 검토 대기" 
          value={stats?.pending_reviews ?? 0} 
          trend="에피소드" 
          color="var(--status-pending)" 
          isLoading={isLoading}
        />
        <StatWidget 
          label="활성 리뷰어" 
          value={stats?.active_reviewers ?? 3842} 
          trend="+124명" 
          color="var(--status-valid)" 
          isLoading={isLoading}
        />
        <StatWidget 
          label="DB 정합성 에러" 
          value={stats?.integrity_errors ?? 0} 
          trend="건수" 
          color="var(--status-error)" 
          isLoading={isLoading}
        />
      </section>

      <section className="dashboard-content-grid">
        <div className="dashboard-main-panel panel">
          <div className="panel-header">
            <h3>운영 업무 큐</h3>
            <p>오늘 처리해야 할 콘텐츠 운영 태스크입니다.</p>
          </div>
          <div className="dashboard-menu-list">
            {projectList.map((project) => (
              <Link key={project.id} to={project.path} className="dashboard-menu-item">
                <div className="menu-icon-box">
                  {project.id === 'content-import' && '📂'}
                  {project.id === 'metadata-review' && '🎬'}
                  {project.id === 'page-preview' && '📱'}
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
              <li className="activity-loading">데이터를 불러오는 중...</li>
            ) : activities && activities.length > 0 ? (
              activities.map((activity) => (
                <li key={activity.id}>
                  <span className="activity-time">{formatTime(activity.created_at)}</span>
                  <p>{activity.message}</p>
                </li>
              ))
            ) : (
              <li className="activity-empty">최근 활동 내역이 없습니다.</li>
            )}
          </ul>
        </aside>
      </section>
    </main>
  )
}

export { HomePage }
