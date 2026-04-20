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

// 중드 리뷰 CMS 도메인에 맞춘 프로젝트 리스트
const projectList: ProjectMeta[] = [
  {
    id: 'content-import',
    path: projectPathMap['content-import'],
    title: 'Episode Import Console',
    description: '중국 드라마 회차별 메타데이터(부제, 방영일) 대량 업로드 및 검증',
    tags: ['에피소드 등록', '데이터 검증', '대량 업로드', '중드 운영'],
  },
  {
    id: 'metadata-review',
    path: projectPathMap['metadata-review'],
    title: 'Drama Metadata Review',
    description: '신규 중드 마스터 정보(배우, 장르, 플랫폼) 검토 및 최종 승인',
    tags: ['마스터 데이터', '변경 감지', '콘텐츠 승인', '배우 정보'],
  },
  {
    id: 'page-preview',
    path: projectPathMap['page-preview'],
    title: 'C-Drama Page Preview',
    description: '리뷰 사이트 내 드라마 상세 페이지 및 회차 목록 UI 미리보기',
    tags: ['UI 미리보기', '데이터 매핑', '모바일 최적화', '팬 커뮤니티'],
  },
]

export { projectList, type ProjectMeta, type ProjectRouteId }
