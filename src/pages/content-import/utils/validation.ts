import type { BulkUploadRow } from "../types/content-import";

/** 문자열이 순수 숫자로만 구성되어 있는지 확인 */
export const isNumeric = (value: string): boolean => {
    if (!value) return false;
    return /^\d+$/.test(value);
};

/** 잘못된 구분자( / ) 포함 여부 확인 */
export const hasBadDelimiter = (value: string): boolean => {
    return /\s\/\s/.test(value);
};

/** 개별 행(Row)에 대한 유효성 검사 */
export const validateRowFields = (params: {
    title: string;
    baseTitle: string;
    rawEpisode: string;
    rating: string;
    summary: string;
}): string[] => {
    const { title, baseTitle, rawEpisode, rating, summary } = params;
    const errors: string[] = [];

    if (!title) {
        errors.push("제목이 누락되었습니다.");
    } else if (baseTitle && title !== baseTitle) {
        errors.push(`다른 드라마 제목이 감지되었습니다("${title}").`);
    }

    if (!rawEpisode) {
        errors.push("회차가 누락되었습니다.");
    } else if (!isNumeric(rawEpisode)) {
        errors.push(`회차 형식 오류: 숫자만 입력 가능합니다. (입력값: "${rawEpisode}")`);
    }

    if (rating && !isNumeric(rating)) {
        errors.push(`등급 형식 오류: 숫자만 입력 가능합니다. (입력값: "${rating}")`);
    }

    if (!summary || summary.length < 10) {
        errors.push("줄거리가 너무 짧거나 누락되었습니다.");
    } else if (hasBadDelimiter(summary)) {
        errors.push("줄거리에 잘못된 구분 기호( / )가 포함되어 있습니다.");
    }

    return errors;
};

/** 전체 데이터 세트에 대한 회차 연속성 및 1화 존재 여부 검증 */
export const applyCollectionValidation = (rows: BulkUploadRow[]): BulkUploadRow[] => {
    // 1. 형식이 틀렸더라도 숫자로 변환 가능한 모든 회차를 수집 (연속성 판단용)
    const allPresentEpisodes = rows
        .map((r) => parseInt(r.episode, 10))
        .filter((e) => !isNaN(e) && e > 0);

    const episodeSet = new Set(allPresentEpisodes);
    const maxEpisode = allPresentEpisodes.length > 0 ? Math.max(...allPresentEpisodes) : 0;
    
    // 2. 진짜로 데이터 자체가 없는 회차들 찾기
    const hasEpisode1 = episodeSet.has(1);
    const missingEpisodes: number[] = [];
    if (maxEpisode > 0) {
        for (let i = 1; i <= maxEpisode; i++) {
            if (!episodeSet.has(i)) {
                missingEpisodes.push(i);
            }
        }
    }

    // 3. 에러 반영
    return rows.map((row) => {
        const newErrors = [...row.errorMessages];
        const currentEpNum = parseInt(row.episode, 10);
        const hasFormatError = !isNumeric(row.episode);

        // [핵심] 현재 행이 '1화'처럼 형식이 틀린 경우, '누락' 메시지는 중복해서 보여주지 않음
        if (!hasEpisode1 && !hasFormatError) {
             if (!newErrors.includes("유효한 1화 데이터가 없습니다.")) {
                newErrors.push("유효한 1화 데이터가 없습니다.");
             }
        }

        // [핵심] 중간 누락 메시지도 현재 행이 그 번호가 아닐 때만 표시
        if (missingEpisodes.length > 0) {
            const missingStr = missingEpisodes.join(", ");
            const msg = `중간에 누락된 회차가 있습니다: [${missingStr}]`;
            if (!newErrors.includes(msg)) {
                newErrors.push(msg);
            }
        }

        return {
            ...row,
            status: newErrors.length > 0 ? "error" : "valid",
            errorMessages: newErrors,
        };
    });
};
