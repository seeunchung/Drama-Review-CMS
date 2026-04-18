// 초기에 만들었던 단일 페이지용 헤더다. 현재 구조에서는 사용하지 않는다.
function PortfolioHeader() {
  return (
    <header className="portfolio-header fade-up">
      <a className="portfolio-brand" href="#top">
        <span className="portfolio-brand-mark">BO</span>
        <span className="portfolio-brand-copy">
          <strong>대량등록 포트폴리오</strong>
          <small>업무형 프론트엔드 케이스 스터디</small>
        </span>
      </a>

      <nav className="portfolio-nav" aria-label="Portfolio sections">
        <a href="#workflow">프로젝트</a>
        <a href="#case-study">케이스 스터디</a>
        <a href="#about">소개</a>
      </nav>

      <span className="portfolio-nav-placeholder" aria-hidden="true">
        깃허브
      </span>
    </header>
  )
}

export { PortfolioHeader }
