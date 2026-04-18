import { useMemo, useState } from 'react'
import { ProjectHeader } from '../../components/layout/project-header'

// 원본 데이터, 매핑 정보, 최종 서비스 미리보기 상태를 전환해 본다.
type PreviewMode = 'raw' | 'mapped' | 'preview'

interface ContentMetadata {
  id: string
  title: string
  status: string
  distributor: string
  director: string
  rating: string
}

const contentList: ContentMetadata[] = [
  { id: 'mov-1', title: '오징어 게임 2', status: '검증완료', distributor: 'Netflix', director: '황동혁', rating: '19세 이용가' },
  { id: 'mov-2', title: '파묘', status: '매핑완료', distributor: 'Showbox', director: '장재현', rating: '15세 이용가' },
  { id: 'mov-3', title: '무도 실무관', status: '미리보기', distributor: 'Netflix', director: '김주환', rating: '15세 이용가' },
]

// 배급사 제공 원본 데이터가 실제 서비스 화면으로 변환되는 과정을 보여준다.
function PagePreviewPage() {
  const [mode, setMode] = useState<PreviewMode>('preview')
  const [selectedId, setSelectedId] = useState<string>('mov-1')

  // 현재 선택된 콘텐츠 정보만 오른쪽 미리보기 패널에 연결한다.
  const selectedContent = useMemo(
    () => contentList.find((item) => item.id === selectedId) ?? contentList[0],
    [selectedId],
  )

  // 원본 데이터를 서비스 UI 필드와 매핑한다.
  const mappingRows = [
    ['콘텐츠 제목', selectedContent.title],
    ['배급사명', selectedContent.distributor],
    ['감독명', selectedContent.director],
    ['관람등급', selectedContent.rating],
  ]

  return (
    <main className="project-page">
      <ProjectHeader
        title="CMS Page Preview"
        description="배급사 제공 원본 데이터를 서비스 화면용 메타데이터로 매핑하고 최종 UI를 미리 확인"
        tags={['데이터 매핑', 'UI 미리보기', '검증 결과 시각화', '콘텐츠 CMS']}
      />

      <div className="screen-toolbar panel">
        <div className="screen-mode-group">
          {([
            ['raw', '원본 데이터'],
            ['mapped', '필드 매핑'],
            ['preview', '서비스 미리보기'],
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
        <span className="screen-toolbar-status">검토 중인 콘텐츠: {selectedContent.title}</span>
      </div>

      <section className="project-screen panel document-layout">
        <aside className="document-list-panel">
          {contentList.map((item) => (
            <button
              className={`document-list-item${selectedId === item.id ? ' is-active' : ''}`}
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
            >
              <strong>{item.title}</strong>
              <span>{item.status}</span>
              <small>{item.distributor}</small>
            </button>
          ))}
        </aside>

        <div className="document-canvas-panel">
          {mode === 'raw' && (
            <pre className="document-code-view">
{`{
  "content_id": "${selectedContent.id}",
  "official_title": "${selectedContent.title}",
  "provider": "${selectedContent.distributor}",
  "credits": {
    "director": "${selectedContent.director}"
  },
  "certification": "${selectedContent.rating}"
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
                <span>서비스 상세 페이지 미리보기</span>
                <strong>{selectedContent.title}</strong>
              </div>
              <div className="document-preview-body">
                <div className="preview-hero-placeholder">
                  [ {selectedContent.title} 메인 포스터 이미지 영역 ]
                </div>
                <div className="preview-info">
                  <p><strong>감독:</strong> {selectedContent.director}</p>
                  <p><strong>배급:</strong> {selectedContent.distributor}</p>
                  <p><strong>등급:</strong> {selectedContent.rating}</p>
                </div>
                <p className="preview-synopsis">
                  {selectedContent.title}에 대한 상세 정보와 흥미진진한 스토리가 이곳에 노출됩니다. 
                  운영자는 이 미리보기를 통해 최종 정합성을 검토합니다.
                </p>
              </div>
            </div>
          )}
        </div>

        <aside className="document-meta-panel">
          <div className="document-meta-box">
            <span>매핑 상태</span>
            <strong>{selectedContent.status}</strong>
          </div>
          <div className="document-meta-box">
            <span>추출 데이터 키</span>
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
