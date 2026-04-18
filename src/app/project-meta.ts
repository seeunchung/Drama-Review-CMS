import {
  projectPathMap,
  type ProjectPath,
  type ProjectRouteId,
} from './paths'

// 홈 카드와 상단 네비가 공유하는 메타 정보다.
interface ProjectMeta {
  id: ProjectRouteId
  path: ProjectPath
  title: string
  description: string
  tags: string[]
}

// 각 화면을 홈 갤러리에서 하나의 항목으로 노출한다.
const projectList: ProjectMeta[] = [
  {
    id: 'content-import',
    path: projectPathMap['content-import'],
    title: 'Content Import Console',
    description: '배급사 영화 메타데이터 대량 업로드, 데이터 검증 및 에러 리뷰',
    tags: ['영화 등록', '데이터 검증', '대량 업로드', '에러 핸들링'],
  },
  {
    id: 'metadata-review',
    path: projectPathMap['metadata-review'],
    title: 'Metadata Review Workspace',
    description: '영화 상세 정보 검토, 변경 사항 감지 및 최종 승인 워크플로우',
    tags: ['운영자 리뷰', '변경 감지', '콘텐츠 승인', '탭 레이아웃'],
  },
  {
    id: 'page-preview',
    path: projectPathMap['page-preview'],
    title: 'CMS Page Preview',
    description: '배급사 제공 원본 데이터의 서비스 화면 매핑 및 최종 미리보기',
    tags: ['미리보기', '데이터 매핑', '렌더링 검증', '파싱'],
  },
]

export { projectList, type ProjectMeta, type ProjectRouteId }
