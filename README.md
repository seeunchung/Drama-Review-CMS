# 🎬 중드 달글 CMS

> **중국 드라마 리뷰 사이트 운영을 위한 콘텐츠 등록·검수·큐레이션 CMS**

본 프로젝트는 중국 드라마 리뷰 사이트 운영팀이 사용하는 백오피스 도구를 가정해 설계한 CMS입니다. 드라마 메타데이터  등록, 사용자 신청 검토 및 이관, 회차 정보 검수, 포스터 관리, 리뷰 큐레이션, 실시간 운영 지표 확인까지 하나의 워크플로우로 연결했습니다.

---

## 🚀 핵심 기능 (Key Features)

### 1. 엑셀 데이터 파싱 및 검증 (Excel Parsing & Validation)
- **엑셀 기반 업로드**: `xlsx` 라이브러리를 활용하여 에피소드 데이터를 브라우저단에서 즉시 파싱합니다.
- **데이터 무결성 가드**: 업로드 전 중복 데이터, 필수값 누락, 타입 불일치 등을 검증하며, 특히 **러닝타임('00:00' 패턴)** 등 도메인 특화 데이터에 대한 엄격한 유효성 검사를 수행합니다.
- **자동 정제(Auto-Normalization)**: '12분 30초', '1230', '45' 등 다양한 형식의 사용자 입력을 표준 형식으로 자동 변환하는 정규화 로직을 탑재하여 운영 효율을 극대화했습니다.

### 2. 드라마 신청 관리 및 데이터 이관 (Application Review & Migration)
- **사용자 신청 검토 화면**: 유저가 등록 요청한 드라마 정보를 별도 신청 테이블에서 조회하고, 운영자가 상세 데이터를 확인한 뒤 승인/거절할 수 있습니다.
- **Adapter 기반 표준화 계층**: 신청 데이터 스키마와 운영 데이터 스키마가 다른 상황을 가정하고, 어댑터 계층에서 이를 `StandardEpisode` 모델로 정규화해 검증 및 후속 워크플로우에 재사용합니다.
- **승인 시 운영 파이프라인 이관**: 신청 승인 시 데이터를 메타데이터 검수용 배치 구조로 이관하여, 실제 운영 프로세스와 동일한 승인 흐름으로 이어지도록 설계했습니다.

### 3. 메타데이터 검수 및 비즈니스 워크플로우 (Business Workflow)
- **운영 프로세스 관리**: 업로드된 배치는 관리자의 검토를 거쳐 `pending` -> `completed`/`failed` 상태로 전환되는 비즈니스 워크플로우를 따릅니다.
- **스토리지 연동 포스터 관리**: Supabase Storage와 연동하여 드라마 포스터를 관리합니다. 포스터 변경 시 기존 파일을 자동으로 삭제하여 스토리지 자원을 효율적으로 관리합니다.
- **조건부 비즈니스 로직**: 승인 거절된 데이터의 수정 제한, 포스터 미등록 시 승인 경고 등 운영 실수를 방지하는 가드레일이 적용되어 있습니다.

### 4. 실시간 대시보드 및 데이터 시각화 (Analytics Dashboard)
- **Real-time Aggregation**: TanStack Query를 활용해 실시간 집계(Aggregation)를 수행하여 가장 최신의 운영 지표를 출력합니다.
- **Recharts 시각화**: 드라마별 인기도(리뷰 수) 및 에피소드별 리뷰 등록 추이를 차트로 제공하여 콘텐츠의 흥행 여부와 유저 이탈 구간을 데이터 기반으로 분석합니다.

### 5. UI/UX 및 상태 관리
- **Zustand Manager System**: 전역 모달(Modal) 및 토스트(Toast) 매니저 시스템을 통해 일관된 사용자 피드백을 제공합니다.
- **테마 시스템 (Dark/Light)**: CSS Variable과 Zustand Persistence를 조합하여 사용자 설정이 유지되는 다크/라이트 모드를 지원합니다.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Zustand (Global UI, Auth, Theme), TanStack Query (Server State)
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **Visualization**: Recharts
- **Styling**: Vanilla CSS (Custom Variable 기반 테마 시스템)

---

## 🏗 Database Architecture

- **`import_batches`**: 업로드 마스터 정보 및 비즈니스 승인 상태 관리 (`pending`, `completed`, `failed`)
- **`episodes`**: 드라마별 상세 에피소드 정보 (FK: batch_id)
- **`drama_applications`**: 사용자가 직접 등록 요청한 드라마 신청 마스터 정보
- **`episode_applications`**: 신청된 드라마의 회차 상세 정보
- **`drama_comments`**: 유저 리뷰 데이터 및 큐레이션 (FK: drama_id)
- **`activities`**: 시스템 내 모든 작업 내역을 기록하는 Audit Log

---

## 🔄 Schema Strategy

이 프로젝트는 **"외부 입력 스키마와 내부 운영 스키마가 항상 같지 않다"**는 실무 상황을 반영합니다.

- 사용자 신청 데이터는 `drama_applications`, `episode_applications`에 저장됩니다.
- 운영 검수 데이터는 `import_batches`, `episodes` 중심의 구조를 사용합니다.
- 두 스키마는 목적이 다르기 때문에, 프론트엔드에서 이를 무리하게 하나로 합치기보다 **어댑터 계층**에서 표준 도메인 모델로 변환합니다.

이 방식의 장점은 다음과 같습니다.

- **외부 시스템 변경 격리**: 신청 폼이나 외부 입력 구조가 바뀌어도 어댑터만 수정하면 됩니다.
- **검증 로직 재사용**: 신청 데이터도 운영 데이터와 같은 검증 규칙을 공유할 수 있습니다.
- **워크플로우 일관성 확보**: 승인 이후에는 동일한 운영 파이프라인으로 흘려보내어 후속 처리 복잡도를 줄입니다.

현재 이 역할은 [`src/lib/adapters.ts`](./src/lib/adapters.ts)에서 수행하며, 사용자 신청 데이터를 `StandardEpisode` 기반의 표준 모델로 변환한 뒤 검증 및 승인 이관 로직에 연결합니다.

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
