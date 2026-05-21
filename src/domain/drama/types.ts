/**
 * ==========================================
 * 1. DB Entities (Snake Case)
 * Supabase 테이블 스키마와 1:1 대응
 * ==========================================
 */

/** DB: drama_applications 테이블 */
export interface DramaApplicationEntity {
    id: string;
    title: string;
    ott: string;
    rating: string;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
}

/** DB: episode_applications 테이블 */
export interface EpisodeApplicationEntity {
    id: number;
    application_id: string;
    episode_no: string;
    subtitle: string;
    running_time: string;
    summary: string;
}

/** DB: import_batches 테이블 */
export interface ImportBatchEntity {
    id: string;
    created_at: string;
    drama_title: string;
    file_name: string;
    status: 'pending' | 'completed' | 'failed';
    poster_url?: string;
}

/** DB: episodes 테이블 */
export interface EpisodeEntity {
    id: number;
    batch_id: string;
    seq: number;
    title: string;
    distributor: string;
    rating: string;
    episode: number;
    subtitle: string;
    running_time: string;
    summary: string;
    status: string;
}

/**
 * ==========================================
 * 2. Domain Models (Camel Case)
 * UI 및 비즈니스 로직에서 사용하는 표준 모델
 * ==========================================
 */

export type RowStatus = 'valid' | 'error' | 'uploaded' | 'pending' | 'completed' | 'failed';

/** 
 * 드라마 에피소드 표준 모델
 */
export interface StandardEpisode {
    id: string;
    seq: number;
    title: string;
    distributor: string; 
    rating: string;      
    episode: string;     
    subtitle: string;
    runningTime: string;
    summary: string;
    status: RowStatus;
    errorMessages: string[];
}

/** 드라마 마스터 표준 모델 */
export interface StandardDramaMaster {
    id: string;
    title: string;
    distributor: string;
    rating: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
    sourceType: 'application' | 'bulk';
}
