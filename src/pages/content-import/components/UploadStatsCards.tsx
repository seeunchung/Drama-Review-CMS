import type { BulkUploadSummary } from '@/pages/content-import/types/content-import'

interface UploadStatsCardsProps {
  summary: BulkUploadSummary
}

// 단계 enum을 카드용 짧은 문구로 다시 매핑한다.
const stepLabelMap = {
  idle: '준비',
  parsed: '파싱 완료',
  validated: '검증 완료',
  reviewed: '리뷰 중',
  saved: '저장 완료',
} as const

// 업로드 흐름의 핵심 수치만 상단 카드로 분리해서 보여준다.
function UploadStatsCards({ summary }: UploadStatsCardsProps) {
  const cards = [
    {
      title: '총 행 수',
      value: summary.total,
      note: '엑셀에서 읽어온 전체 행',
    },
    {
      title: '정상 행 수',
      value: summary.valid,
      note: '저장 단계로 넘어갈 수 있는 행',
    },
    {
      title: '에러 행 수',
      value: summary.error,
      note: '운영자 검토가 필요한 행',
    },
    {
      title: '현재 상태',
      value: stepLabelMap[summary.currentStep],
      note: '현재 워크플로우 단계',
    },
  ]

  return (
    <div className="upload-stats-grid">
      {cards.map((card) => (
        <article className="upload-stat-card" key={card.title}>
          <span>{card.title}</span>
          <strong>{card.value}</strong>
          <small>{card.note}</small>
        </article>
      ))}
    </div>
  )
}

export { UploadStatsCards }
