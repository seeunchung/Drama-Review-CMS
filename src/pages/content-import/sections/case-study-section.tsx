import { caseStudyCards, systemFlow } from '../mocks/content-import-data'


function CaseStudySection() {
  return (
    <section className="panel fade-up" id="case-study">
      <div className="section-heading">
        <div>
          <span className="section-kicker">케이스 스터디</span>
          <h2>문제 정의와 해결 방식</h2>
        </div>
        <p>
          이 페이지는 소개용 랜딩이 아니라 실무형 케이스 스터디 구조를 따른다.
          데이터가 많은 업무 화면을 어떻게 리뷰 중심 UI로 바꿨는지 보여준다.
        </p>
      </div>

      <div className="case-study-grid">
        {caseStudyCards.map((card) => (
          <article className="case-study-card" key={card.title}>
            <span>{card.title}</span>
            <p>{card.body}</p>
          </article>
        ))}
      </div>

      <div className="system-flow">
        {systemFlow.map((item, index) => (
          <div className="system-flow-item" key={item}>
            <strong>{`0${index + 1}`}</strong>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export { CaseStudySection }
