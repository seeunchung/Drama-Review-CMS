import {
  heroBadges,
  workflowHighlights,
} from '../mocks/content-import-data'

// 예전 소개형 구성을 유지할 때 쓰던 Bulk Upload 히어로다.
function UploadHero() {
  return (
    <section className="upload-hero fade-up" id="top">
      <div className="upload-hero-copy">
        <span className="section-kicker">대표 사례 01</span>
        <h1>엑셀 대량 업로드 워크플로우</h1>
        <p className="upload-hero-description">
          실무형 대량등록 화면을 업로드, 프론트 파싱, 검증, 에러 리뷰, 단계형 저장
          흐름으로 재구성한 프론트엔드 사례입니다.
        </p>

        <div className="hero-badges" aria-label="기술 태그">
          {heroBadges.map((badge) => (
            <span className="hero-badge" key={badge}>
              {badge}
            </span>
          ))}
        </div>
      </div>

      <aside className="hero-console">
        <span className="hero-console-label">핵심 포지셔닝</span>
        <h2>복잡한 업무용 업로드 흐름을 프론트엔드에서 설계합니다.</h2>
        <ul className="hero-console-list">
          {workflowHighlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </section>
  )
}

export { UploadHero }
