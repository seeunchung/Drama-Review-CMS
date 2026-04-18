import type {
  BulkUploadRow,
  DemoSelectedFile,
  UploadStep,
} from '../types/content-import'

// 단계 스테퍼와 화면 카피가 같은 기준을 쓰도록 목데이터로 분리했다.
const uploadStepMeta: Array<{
  key: UploadStep
  label: string
  detail: string
}> = [
  { key: 'idle', label: '업로드', detail: '영화 메타데이터 파일 선택' },
  { key: 'parsed', label: '파싱', detail: '콘텐츠 정보를 시스템 형식으로 변환' },
  { key: 'validated', label: '검증', detail: '필수 메타(등급, 장르) 누락 여부 검사' },
  { key: 'reviewed', label: '리뷰', detail: '데이터 정합성 에러 행 검토' },
  { key: 'saved', label: '저장', detail: 'CMS 마스터 데이터 저장 완료' },
]

const heroBadges = ['React', 'TypeScript', '콘텐츠 CMS', '데이터 파이프라인']

const workflowHighlights = [
  '배급사 제공 원본 데이터 전처리',
  '관람 등급 및 장르 코드 자동 검증',
  '대량 콘텐츠 마스터 데이터 동기화',
]

const caseStudyCards = [
  {
    title: '문제',
    body:
      '신규 OTT 런칭이나 시즌 업데이트 시 수만 편의 영화/드라마 데이터를 한꺼번에 등록해야 한다. 배급사마다 데이터 형식이 달라 저장 전 정합성 검토가 필수적이었다.',
  },
  {
    title: '프론트엔드 전략',
    body:
      '대량 등록을 단순 업로드가 아닌 파싱-검증-리뷰-저장의 파이프라인으로 설계했다. 특히 관람 등급이나 국가 코드를 프론트에서 즉시 검증하여 운영자의 작업 효율을 높였다.',
  },
  {
    title: '설계 이유',
    body:
      '다양한 배급사의 데이터를 수용하기 위해 UI 모델을 유연하게 잡았다. 데이터가 늘어나도 필터와 정렬을 통해 에러가 있는 콘텐츠만 빠르게 골라낼 수 있는 구조가 핵심이다.',
  },
]

const systemFlow = [
  '배급사에서 받은 엑셀 파일을 업로드하고 컨텍스트를 유지한다.',
  '콘텐츠 제목, 배급사, 관람 등급 등 핵심 필드를 파싱하고 타입화한다.',
  '필수 정보 누락이나 허용되지 않는 등급 코드 등의 에러를 가시화한다.',
  '정합성이 확인된 마스터 데이터를 청크 단위로 CMS에 저장한다.',
]

const outcomeCards = [
  {
    title: '데이터 무결성',
    body:
      '저장 전에 관람 등급 등 법적 필수 정보를 강제 검증하므로 서비스 장애 리스크를 최소화한다.',
  },
  {
    title: '작업 효율 개선',
    body:
      '수천 건의 데이터 중 에러가 있는 콘텐츠만 즉시 필터링하여 수정 요청을 보낼 수 있다.',
  },
  {
    title: '확장 가능한 아키텍처',
    body:
      '신규 배급사나 새로운 콘텐츠 포맷이 추가되어도 동일한 검토 프로세스를 재사용할 수 있다.',
  },
]

const skillTags = [
  '콘텐츠 운영 도구 설계',
  '메타데이터 검증',
  '복잡한 데이터 워크플로우',
  '상태 기반 리뷰 시스템',
  '엔터프라이즈 UX',
]

const sampleFile: DemoSelectedFile = {
  name: '2026_상반기_배급데이터_목록.xlsx',
  size: 3150422,
  typeLabel: 'XLSX',
}

// 결과 테이블은 정상 행과 에러 행이 섞인 상태를 기본 시나리오로 보여준다.
const baseRows: BulkUploadRow[] = [
  {
    id: 'row-1',
    seq: 1,
    title: '오징어 게임 시즌 2',
    distributor: 'Netflix',
    rating: '19세 이용가',
    status: 'valid',
  },
  {
    id: 'row-2',
    seq: 2,
    title: '무도 실무관',
    distributor: 'Netflix',
    rating: '',
    status: 'error',
    errorMessage: '관람 등급 정보가 누락되었습니다.',
  },
  {
    id: 'row-3',
    seq: 3,
    title: '파묘',
    distributor: 'Showbox',
    rating: '15세 이용가',
    status: 'valid',
  },
  {
    id: 'row-4',
    seq: 4,
    title: '범죄도시 4',
    distributor: 'ABO Entertainment',
    rating: 'ADULT',
    status: 'error',
    errorMessage: '지원하지 않는 등급 코드 형식입니다. (국내 표준 코드 필요)',
  },
  {
    id: 'row-5',
    seq: 5,
    title: '인사이드 아웃 2',
    distributor: 'Disney+',
    rating: '전체 관람가',
    status: 'valid',
  },
  {
    id: 'row-6',
    seq: 6,
    title: '데드풀과 울버린',
    distributor: 'Disney+',
    rating: '19세 이용가',
    status: 'valid',
  },
  {
    id: 'row-7',
    seq: 7,
    title: '베테랑 2',
    distributor: '',
    rating: '15세 이용가',
    status: 'error',
    errorMessage: '배급사 정보가 비어 있습니다.',
  },
  {
    id: 'row-8',
    seq: 8,
    title: '에이리언: 로물루스',
    distributor: '20th Century Studios',
    rating: '15세 이용가',
    status: 'valid',
  },
  {
    id: 'row-9',
    seq: 9,
    title: '글래디에이터 II',
    distributor: 'Paramount',
    rating: '19세 이용가',
    status: 'valid',
  },
  {
    id: 'row-10',
    seq: 10,
    title: '모아나 2',
    distributor: 'Disney+',
    rating: '전체 관람가',
    status: 'error',
    errorMessage: '콘텐츠 ID 중복: 이미 등록된 영화입니다.',
  },
]

// 프리셋 전환 때 원본 배열이 오염되지 않도록 매번 복사본을 만든다.
function createBulkUploadMockRows() {
  return baseRows.map((row) => ({ ...row }))
}

export {
  caseStudyCards,
  createBulkUploadMockRows,
  heroBadges,
  outcomeCards,
  sampleFile,
  skillTags,
  systemFlow,
  uploadStepMeta,
  workflowHighlights,
}
