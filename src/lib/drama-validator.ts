import { StandardEpisode } from "@/app/types/drama";

/** 문자열에서 숫자만 추출 (예: "15세이상" -> "15", "제1화" -> "1") */
export const extractNumbers = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return "";
    return String(value).replace(/[^0-9]/g, "");
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
    
    // 2. 이미 00:00 형식인 경우
    if (/^\d{2}:\d{2}$/.test(value)) return value;

    // 3. 한글 '분', '초' 처리 또는 구분자 처리
    const parts = value.split(/[^0-9]+/).filter(Boolean);
    
    if (parts.length >= 2) {
        const mm = parts[0].padStart(2, "0").slice(-2);
        const ss = parts[1].padStart(2, "0").slice(-2);
        return `${mm}:${ss}`;
    }
    
    if (digits.length === 1 || digits.length === 2) {
        return `${digits.padStart(2, "0")}:00`;
    } else if (digits.length === 3) {
        return `0${digits.slice(0, 1)}:${digits.slice(1)}`;
    } else if (digits.length === 4) {
        return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    }

    return value;
};

/** 문자열이 '00:00' 형식의 러닝타임 패턴인지 확인 */
export const isValidRunningTime = (value: string): boolean => {
    if (!value) return false;
    return /^\d{2}:\d{2}$/.test(value);
};

/** 개별 행(Row)에 대한 유효성 검사 */
export const validateDramaRow = (params: {
    title: string;
    baseTitle: string;
    rawEpisode: string;
    rating: string;
    summary: string;
    runningTime?: string;
}): string[] => {
    const { title, baseTitle, rawEpisode, rating, summary, runningTime } = params;
    const errors: string[] = [];

    // 1. 필수값 및 정합성 검증
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

    // 2. 형식 패턴 검증
    if (runningTime && !isValidRunningTime(runningTime)) {
        errors.push(`러닝타임 형식 오류: "00:00" 형식이 필요합니다. (입력값: "${runningTime}")`);
    }

    // 3. 줄거리 검증
    if (!summary || summary.length < 10) {
        errors.push("줄거리가 너무 짧거나 누락되었습니다.");
    } else if (hasBadDelimiter(summary)) {
        errors.push("줄거리에 잘못된 구분 기호( / )가 포함되어 있습니다.");
    }

    return errors;
};

/** 
 * 전체 데이터 세트에 대한 회차 연속성 및 1화 존재 여부 검증 
 * @template T StandardEpisode를 상속받는 타입
 */
export const applyDramaCollectionValidation = <T extends StandardEpisode>(rows: T[]): T[] => {
    if (rows.length === 0) return rows;

    const allPresentEpisodes = rows
        .map((r) => parseInt(r.episode, 10))
        .filter((e) => !isNaN(e) && e > 0);

    const episodeSet = new Set(allPresentEpisodes);
    const maxEpisode = allPresentEpisodes.length > 0 ? Math.max(...allPresentEpisodes) : 0;
    
    const hasEpisode1 = episodeSet.has(1);
    const missingEpisodes: number[] = [];
    
    if (maxEpisode > 0) {
        for (let i = 1; i <= maxEpisode; i++) {
            if (!episodeSet.has(i)) {
                missingEpisodes.push(i);
            }
        }
    }

    return rows.map((row) => {
        const newErrors = [...row.errorMessages];
        const hasFormatError = !isNumeric(row.episode);

        // 1화 존재 여부 체크
        if (!hasEpisode1 && !hasFormatError) {
             if (!newErrors.includes("유효한 1화 데이터가 없습니다.")) {
                newErrors.push("유효한 1화 데이터가 없습니다.");
             }
        }

        // 중간 누락 회차 체크
        if (missingEpisodes.length > 0) {
            const missingStr = missingEpisodes.join(", ");
            const msg = `중간에 누락된 회차가 있습니다: [${missingStr}]`;
            if (!newErrors.includes(msg)) {
                newErrors.push(msg);
            }
        }

        // 상태 결정 로직 (에러가 있으면 error, 없으면 기존 상태 유지 또는 valid)
        let finalStatus = row.status;
        if (newErrors.length > 0) {
            finalStatus = 'error';
        } else if (row.status === 'error' || row.status === 'pending') {
            finalStatus = 'valid';
        }

        return {
            ...row,
            status: finalStatus,
            errorMessages: newErrors,
        };
    });
};
