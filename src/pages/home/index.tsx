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

// 홈 화면을 전문적인 운영 대시보드로 구성
function HomePage() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-title-group">
          <span className="dashboard-kicker">System Overview</span>
          <h1>운영 대시보드</h1>
          <p>전체 콘텐츠 등록 현황 및 주요 운영 지표를 확인합니다.</p>
        </div>
        <div className="dashboard-actions">
           <Link to="/content-import" className="quick-action-button">
             신규 콘텐츠 일괄 등록
           </Link>
        </div>
      </section>

      {/* 실무 시스템 느낌의 통계 영역 */}
      <section className="dashboard-stats-grid">
        <StatWidget label="오늘 등록된 콘텐츠" value="24" trend="+12%↑" color="var(--accent)" />
        <StatWidget label="검토 대기 중" value="12" trend="긴급 3건" color="var(--status-pending)" />
        <StatWidget label="최종 승인 완료" value="1,204" trend="+8건" color="var(--status-valid)" />
        <StatWidget label="데이터 오류 건수" value="2" trend="-5%↓" color="var(--status-error)" />
      </section>

      <section className="dashboard-content-grid">
        {/* 주요 업무 바로가기 섹션 (기존 카드 대체) */}
        <div className="dashboard-main-panel panel">
          <div className="panel-header">
            <h3>주요 업무 바로가기</h3>
            <p>수행할 업무 단계를 선택하세요.</p>
          </div>
          <div className="dashboard-menu-list">
            {projectList.map((project) => (
              <Link key={project.id} to={project.path} className="dashboard-menu-item">
                <div className="menu-icon-box">
                  {project.id === 'content-import' && '📥'}
                  {project.id === 'metadata-review' && '⚖️'}
                  {project.id === 'page-preview' && '🖥️'}
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

        {/* 시스템 공지 또는 활동 내역 (더미) */}
        <aside className="dashboard-side-panel panel">
          <div className="panel-header">
            <h3>최근 활동 내역</h3>
          </div>
          <ul className="activity-list">
            <li>
              <span className="activity-time">10:24</span>
              <p>Netflix '오징어 게임 2' 승인 완료</p>
            </li>
            <li>
              <span className="activity-time">09:15</span>
              <p>배급사 'Disney+' 신규 데이터 업로드</p>
            </li>
            <li>
              <span className="activity-time">어제</span>
              <p>시스템 정기 점검 완료</p>
            </li>
          </ul>
        </aside>
      </section>
    </main>
  )
}

export { HomePage }
