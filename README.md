# 🎬 중드 달글 CMS (Content Management System)

> **중국 드라마 콘텐츠 메타데이터 대량 등록 및 리뷰 큐레이션 운영 도구**

본 프로젝트는 대규모 드라마 에피소드 데이터를 효율적으로 관리하고, 유저 반응을 실시간으로 모니터링하기 위해 구축된 전문 백오피스 시스템입니다. 엑셀 파싱부터 데이터 무결성 검증, 실시간 통계 시각화까지 실무적인 비즈니스 로직을 포함하고 있습니다.

---

## 🚀 핵심 기능 (Key Features)

### 1. 대량 데이터 임포트 및 검증 (Bulk Import & Validation)
- **엑셀 기반 벌크 업로드**: `xlsx` 라이브러리를 활용하여 수천 건의 에피소드 데이터를 브라우저단에서 즉시 파싱합니다.
- **데이터 무결성 가드**: 업로드 전 중복 데이터, 필수값 누락, 타입 불일치 등을 검증하여 에러 레포트를 제공합니다.
- **청크(Chunk) 단위 업로드**: 네트워크 부하를 방지하기 위해 데이터를 청크 단위로 나누어 순차적으로 처리하며, 진행 상황을 실시간 프로그레스 바로 시각화합니다.

### 2. 메타데이터 검토 및 에셋 관리 (Metadata Review)
- **워크플로우 관리**: `Pending` -> `Completed`/`Failed`로 이어지는 승인 프로세스를 구현했습니다.
- **스토리지 연동 포스터 관리**: Supabase Storage와 연동하여 드라마 포스터를 관리합니다. 포스터 변경 시 기존 파일을 자동으로 삭제하여 스토리지 자원을 효율적으로 관리합니다.
- **조건부 비즈니스 로직**: 승인 거절된 데이터의 수정 제한, 포스터 미등록 시 승인 경고 등 운영 실수를 방지하는 로직이 적용되어 있습니다.

### 3. 실시간 대시보드 및 데이터 시각화 (Analytics Dashboard)
- **Real-time Aggregation**: DB 뷰(View)에 의존하지 않고, 프론트엔드 API에서 직접 실시간 집계(Aggregation)를 수행하여 가장 최신의 지표를 출력합니다.
- **Recharts 시각화**: 드라마별 인기도(리뷰 수) 및 에피소드별 리뷰 등록 추이를 차트로 제공하여 콘텐츠의 흥행 여부와 유저 이탈 구간을 한눈에 파악합니다.

### 4. 고도화된 UI/UX 시스템
- **Manager-style Global UI**: Zustand를 활용한 전역 모달(Modal) 및 토스트(Toast) 매니저 시스템을 구축하여 일관된 피드백을 제공합니다.
- **테마 시스템 (Dark/Light)**: CSS Variable과 Zustand Persistence를 조합하여 사용자의 설정이 유지되는 다크/라이트 모드를 완벽하게 지원합니다.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Zustand (Global UI, Auth, Theme), TanStack Query (Server State)
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **Visualization**: Recharts
- **Styling**: Vanilla CSS (Custom Variable 기반 테마 시스템)

---

## 🏗 Database Architecture

- **`import_batches`**: 대량 업로드 마스터 정보 및 드라마 상태 관리
- **`episodes`**: 드라마별 상세 에피소드 정보 (FK: batch_id)
- **`drama_comments`**: 유저 리뷰 데이터 및 큐레이션 (FK: drama_id)
- **`activities`**: 시스템 내 모든 작업 내역을 기록하는 Audit Log
- **RLS (Row Level Security)**: 조회 권한은 Public, 쓰기 권한은 인증된 관리자로 엄격히 제한

---

## 🏃 Getting Started

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   `.env` 파일에 Supabase API URL과 Anon Key를 입력합니다.

3. **로컬 실행**
   ```bash
   npm run dev
   ```

4. **테스트 데이터 생성**
   대시보드 상단의 **[테스트 데이터 시딩]** 버튼을 클릭하여 전체 데이터 관계를 즉시 구축할 수 있습니다.
