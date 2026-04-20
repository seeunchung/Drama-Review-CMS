import { Link } from 'react-router-dom'
import { projectList } from '../../app/project-meta'

// 대시보드 상단에 노출할 통계 위젯
function StatWidget({ label, value, trend, color }: { label: string, value: string, trend: string, color?: string }) {
  return (
    <div className="stat-widget panel">
      <span className="stat-label">{label}</span>
      <div className="stat-value-group">
        <strong style={{ color: color || 'var(--ink-strong)' }}>{value}</strong>
        <span className="stat-trend">{trend}</span>
      </div>
    </div>
  )
}

// 중드 리뷰 CMS 대시보드
function HomePage() {
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
        <StatWidget label="이번 주 신작 등록" value="8" trend="+2건↑" color="var(--accent)" />
        <StatWidget label="회차 검토 대기" value="45" trend="투투장부주 포함" color="var(--status-pending)" />
        <StatWidget label="활성 리뷰어" value="3,842" trend="+124명" color="var(--status-valid)" />
        <StatWidget label="DB 정합성 에러" value="1" trend="-2건↓" color="var(--status-error)" />
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
            <li>
              <span className="activity-time">방금 전</span>
              <p>'암격리적비밀' 24화 메타데이터 수정</p>
            </li>
            <li>
              <span className="activity-time">1시간 전</span>
              <p>'절요' 출연진 정보 대량 업데이트</p>
            </li>
            <li>
              <span className="activity-time">오늘</span>
              <p>'투투장부주' 에피소드 1-10화 승인</p>
            </li>
            <li>
              <span className="activity-time">어제</span>
              <p>신규 장르 '선협물' 카테고리 추가</p>
            </li>
          </ul>
        </aside>
      </section>
    </main>
  )
}

export { HomePage }
