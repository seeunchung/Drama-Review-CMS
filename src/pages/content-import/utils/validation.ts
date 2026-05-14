import type { BulkUploadRow } from "../types/content-import";

/** 문자열에서 숫자만 추출 (예: "15세이상" -> "15", "제1화" -> "1") */
export const extractNumbers = (value: string): string => {
    return value.replace(/[^0-9]/g, "");
};

/** 문자열이 순수 숫자로만 구성되어 있는지 확인 */
export const isNumeric = (value: string): boolean => {
    if (!value) return false;
    return /^\d+$/.test(value);
};

/** 잘못된 구분자( / ) 포함 여부 확인 */
export const hasBadDelimiter = (value: string): boolean => {
    return /\s\/\s/.test(value);
};

/** 러닝타임 형식을 '00:00'으로 정규화 */
export const normalizeRunningTime = (value: string): string => {
    if (!value) return "";
    
    // 1. 숫자만 추출
    const digits = value.replace(/[^0-9]/g, "");
    
    // 2. 이미 00:00 형식인 경우 (숫자 4개이고 원본에 : 가 있는 경우 등)
    if (/^\d{2}:\d{2}$/.test(value)) return value;

    // 3. 한글 '분', '초' 처리 또는 구분자 처리
    // 예: "12분 30초", "12:30", "12 30"
    const parts = value.split(/[^0-9]+/).filter(Boolean);
    
    if (parts.length >= 2) {
        const mm = parts[0].padStart(2, "0").slice(-2);
        const ss = parts[1].padStart(2, "0").slice(-2);
        return `${mm}:${ss}`;
    }
    
    // 4. 숫자만 들어온 경우 (예: "45" -> "45:00", "1230" -> "12:30")
    if (digits.length === 1 || digits.length === 2) {
        return `${digits.padStart(2, "0")}:00`;
    } else if (digits.length === 3) {
        // "123" -> "01:23"
        return `0${digits.slice(0, 1)}:${digits.slice(1)}`;
    } else if (digits.length === 4) {
        // "1230" -> "12:30"
        return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    }

    return value; // 변환 불가 시 원본 반환
};

/** 문자열이 '00:00' 형식의 러닝타임 패턴인지 확인 */
export const isValidRunningTime = (value: string): boolean => {
    if (!value) return false;
    return /^\d{2}:\d{2}$/.test(value);
};

/** 개별 행(Row)에 대한 유효성 검사 */
export const validateRowFields = (params: {
    title: string;
    baseTitle: string;
    rawEpisode: string;
    rating: string;
    summary: string;
    runningTime?: string;
}): string[] => {
    const { title, baseTitle, rawEpisode, rating, summary, runningTime } = params;
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

    if (runningTime && !isValidRunningTime(runningTime)) {
        errors.push(`러닝타임 형식 오류: "00:00" 형식이 필요합니다. (입력값: "${runningTime}")`);
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
