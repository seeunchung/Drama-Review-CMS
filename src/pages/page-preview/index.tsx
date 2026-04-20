import { useMemo, useState } from 'react'
import { ProjectHeader } from '../../components/layout/project-header'

// 원본 데이터, 매핑 정보, 최종 서비스 미리보기 상태를 전환해 본다.
type PreviewMode = 'raw' | 'mapped' | 'preview'

interface DramaMetadata {
  id: string
  title: string
  status: string
  platform: string
  actors: string
  genre: string
}

const dramaList: DramaMetadata[] = [
  { id: 'cd-1', title: '암격리적비밀', status: '검증완료', platform: 'iQIYI', actors: '진철원, 서몽결', genre: '학원물 / 로맨스' },
  { id: 'cd-2', title: '투투장부주', status: '매핑완료', platform: 'Youku', actors: '진철원, 조로사', genre: '로맨스 / 현대극' },
  { id: 'cd-3', title: '난홍', status: '미리보기', platform: 'Youku', actors: '백경정, 장약남', genre: '로맨스 / 오피스' },
  { id: 'cd-4', title: '옥을 찾아서', status: '대기중', platform: 'WeTV', actors: '조로사, 류우녕', genre: '고장극 / 모험' },
]

// 배급사 제공 원본 데이터가 중드 리뷰 사이트 화면으로 변환되는 과정을 보여준다.
function PagePreviewPage() {
  const [mode, setMode] = useState<PreviewMode>('preview')
  const [selectedId, setSelectedId] = useState<string>('cd-1')

  // 현재 선택된 드라마 정보만 오른쪽 미리보기 패널에 연결한다.
  const selectedDrama = useMemo(
    () => dramaList.find((item) => item.id === selectedId) ?? dramaList[0],
    [selectedId],
  )

  // 원본 데이터를 팬 사이트 UI 필드와 매핑한다.
  const mappingRows = [
    ['작품 제목', selectedDrama.title],
    ['방영 플랫폼', selectedDrama.platform],
    ['주연 배우', selectedDrama.actors],
    ['드라마 장르', selectedDrama.genre],
  ]

  return (
    <main className="project-page">
      <ProjectHeader
        title="C-Drama Page Preview"
        description="드라마 상세 정보가 실제 팬 커뮤니티나 리뷰 사이트 UI에 어떻게 매핑되어 노출되는지 미리 확인합니다."
        tags={['팬 사이트 미리보기', '데이터 매핑', 'UI 시뮬레이션', '중드 도메인']}
      />

      <div className="screen-toolbar panel">
        <div className="screen-mode-group">
          {([
            ['raw', 'Raw 데이터'],
            ['mapped', '필드 매핑'],
            ['preview', '팬 사이트 미리보기'],
          ] as Array<[PreviewMode, string]>).map(([item, label]) => (
            <button
              className={mode === item ? 'is-active' : ''}
              key={item}
              type="button"
              onClick={() => setMode(item)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="screen-toolbar-status">검토 작품: {selectedDrama.title}</span>
      </div>

      <section className="project-screen panel document-layout">
        <aside className="document-list-panel">
          {dramaList.map((item) => (
            <button
              className={`document-list-item${selectedId === item.id ? ' is-active' : ''}`}
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
            >
              <strong>{item.title}</strong>
              <span>{item.status}</span>
              <small>{item.platform}</small>
            </button>
          ))}
        </aside>

        <div className="document-canvas-panel">
          {mode === 'raw' && (
            <pre className="document-code-view">
{`{
  "drama_id": "${selectedDrama.id}",
  "title": "${selectedDrama.title}",
  "streaming_on": "${selectedDrama.platform}",
  "cast": "${selectedDrama.actors}",
  "categories": ["${selectedDrama.genre.split(' / ').join('", "')}"]
}`}
            </pre>
          )}

          {mode === 'mapped' && (
            <div className="mapping-card">
              {mappingRows.map(([label, value]) => (
                <div className="mapping-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          )}

          {mode === 'preview' && (
            <div className="document-preview-sheet">
              <div className="document-preview-head">
                <span>리뷰 사이트 상세 페이지 미리보기</span>
                <strong>{selectedDrama.title}</strong>
              </div>
              <div className="document-preview-body">
                <div className="preview-hero-placeholder">
                  [ {selectedDrama.title} 메인 포스터 & 스틸컷 영역 ]
                </div>
                <div className="preview-info">
                  <p><strong>출연:</strong> {selectedDrama.actors}</p>
                  <p><strong>채널:</strong> {selectedDrama.platform}</p>
                  <p><strong>장르:</strong> {selectedDrama.genre}</p>
                </div>
                <p className="preview-synopsis">
                  {selectedDrama.title}는 팬들 사이에서 큰 화제를 모으고 있는 작품입니다. 
                  고퀄리티의 자막과 함께 상세한 리뷰 정보를 제공하기 위해 데이터를 검토 중입니다.
                </p>
                <div className="preview-episode-list">
                  <div className="preview-line wide" />
                  <div className="preview-line" />
                  <div className="preview-line" />
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="document-meta-panel">
          <div className="document-meta-box">
            <span>최종 상태</span>
            <strong>{selectedDrama.status}</strong>
          </div>
          <div className="document-meta-box">
            <span>매핑 데이터 키</span>
            <ul className="document-key-list">
              {mappingRows.map(([label]) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}

export { PagePreviewPage };
