import { outcomeCards, skillTags } from '../mocks/content-import-data'

// 예전 포트폴리오 서술형 구성을 유지할 때 쓰던 하단 섹션이다.
function OutcomeSection() {
  return (
    <section className="panel fade-up" id="about">
      <div className="section-heading">
        <div>
          <span className="section-kicker">결과</span>
          <h2>운영 관점의 결과와 포트폴리오 포지셔닝</h2>
        </div>
        <p>
          이 화면은 화려함보다 운영 안정성과 검토 가능성을 우선한다. 그 방향 자체가
          이 포트폴리오의 핵심 메시지다.
        </p>
      </div>

      <div className="outcome-grid">
        {outcomeCards.map((card) => (
          <article className="outcome-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>

      <div className="about-panel">
        <div>
          <span className="section-kicker">소개</span>
          <h3>운영자와 검토자를 위한 데이터 중심 프론트엔드 시스템</h3>
        </div>
        <p>
          단순 소개 사이트보다 입력 구조가 복잡한 업무 화면을 다루는 데 강점이 있다.
          구조화된 입력을 파싱하고, 실패 행을 분리하고, 정상 데이터만 통제된 저장
          경로로 넘기는 인터페이스를 만든다.
        </p>

        <div className="skill-tag-grid" aria-label="이 사례에 사용한 역량">
          {skillTags.map((tag) => (
            <span className="skill-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export { OutcomeSection }
