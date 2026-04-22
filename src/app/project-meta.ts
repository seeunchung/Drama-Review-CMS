import {
  projectPathMap,
} from './paths'

export type ProjectRouteId = 'content-import' | 'metadata-review' | 'page-preview'
export type ProjectPath = typeof projectPathMap[ProjectRouteId]

// 홈 카드와 상단 네비가 공유하는 메타 정보다.
interface ProjectMeta {
  id: ProjectRouteId
  title: string
  description: string
  path: ProjectPath
}

export const projectList: ProjectMeta[] = [
  {
    id: 'content-import',
    title: '콘텐츠 임포트',
    description: '드라마 메타데이터 엑셀 대량 등록 및 검토',
    path: projectPathMap['content-import'],
  },
  {
    id: 'metadata-review',
    title: '메타데이터 검토',
    description: '등록된 영상 콘텐츠의 상세 정보 교정 및 승인',
    path: projectPathMap['metadata-review'],
  },
  {
    id: 'page-preview',
    title: '페이지 프리뷰',
    description: '앱/웹 서비스 노출 전 미리보기 및 기기별 대응 확인',
    path: projectPathMap['page-preview'],
  },
]
