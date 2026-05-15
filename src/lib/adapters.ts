import { 
    DramaApplicationEntity, 
    EpisodeApplicationEntity, 
    ImportBatchEntity,
    StandardEpisode,
    StandardDramaMaster 
} from "@/app/types/drama";

/**
 * 사용자 신청 내역을 표준 에피소드 모델 리스트로 변환
 */
export const toStandardEpisodesFromApplication = (
    master: DramaApplicationEntity, 
    episodes: EpisodeApplicationEntity[]
): StandardEpisode[] => {
    return episodes.map((ep) => ({
        id: `app-ep-${ep.id}`,
        seq: parseInt(ep.episode_no, 10) || 0,
        title: master.title,
        distributor: master.ott, // ott -> distributor 매핑
        rating: master.rating,
        episode: ep.episode_no, // episode_no -> episode 매핑
        subtitle: ep.subtitle || "",
        runningTime: ep.running_time || "", // snake -> camel
        summary: ep.summary || "",
        status: 'pending',
        errorMessages: []
    }));
};

/**
 * 사용자 신청 마스터를 표준 마스터 모델로 변환
 */
export const toStandardMasterFromApplication = (app: DramaApplicationEntity): StandardDramaMaster => {
    return {
        id: app.id,
        title: app.title,
        distributor: app.ott,
        rating: app.rating,
        status: app.status,
        createdAt: app.created_at,
        sourceType: 'application'
    };
};

/**
 * 벌크 업로드 배치를 표준 마스터 모델로 변환
 */
export const toStandardMasterFromImportBatch = (batch: ImportBatchEntity): StandardDramaMaster => {
    return {
        id: batch.id,
        title: batch.drama_title,
        distributor: "Unknown", // 배치 레벨에는 distributor 정보가 없으므로 기본값
        rating: "Unknown",      // 배치 레벨에는 등급 정보가 없으므로 기본값
        status: batch.status,
        createdAt: batch.created_at,
        sourceType: 'bulk'
    };
};
