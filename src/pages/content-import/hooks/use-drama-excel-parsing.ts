import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import type { BulkUploadRow, RowStatus } from "../types/content-import";

/** 드라마 리뷰 엑셀 파싱 및 검증 훅 */
export function useDramaExcelParsing() {
    const [isParsing, setIsParsing] = useState(false);

    /** 특수문자나 잘못된 구분자 체크 */
    const hasBadDelimiter = (value: string): boolean => {
        return /\s\/\s/.test(value);
    };

    const parseExcel = useCallback(
        async (file: File): Promise<BulkUploadRow[]> => {
            setIsParsing(true);

            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(
                            e.target?.result as ArrayBuffer,
                        );
                        const workbook = XLSX.read(data, { type: "array" });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];

                        // 헤더 포함 전체 데이터를 JSON 배열로 추출 (header: 1은 [ [row1_col1, row1_col2], [row2_col1, ... ] ] 형태)
                        const rows = XLSX.utils.sheet_to_json<any[]>(
                            worksheet,
                            { header: 1 },
                        );

                        if (rows.length <= 1) {
                            throw new Error(
                                "파싱된 데이터가 없거나 헤더만 존재합니다.",
                            );
                        }

                        const parsedRows: BulkUploadRow[] = [];
                        let lastTitle = "";
                        let lastDistributor = "";
                        let lastRating = "";

                        // 첫 번째 행은 헤더라고 가정하고 인덱스 1부터 시작
                        for (let i = 1; i < rows.length; i++) {
                            const row = rows[i];
                            if (!row || row.length === 0) continue;

                            // 데이터 추출 및 병합 셀 보정 (A, B, C열)
                            const rawTitle = String(row[0] || "").trim();
                            const rawDistributor = String(row[1] || "").trim();
                            const rawRating = String(row[2] || "").trim();
                            const rawEpisode = String(row[3] || "").trim();
                            const subtitle = String(row[4] || "").trim();
                            const runningTime = String(row[5] || "").trim();
                            const summary = String(row[6] || "").trim();

                            // 비어있으면 이전 행의 값을 사용 (Fill-down 로직)
                            const title = rawTitle || lastTitle;
                            const distributor =
                                rawDistributor || lastDistributor;
                            const rating = rawRating || lastRating;

                            // 다음 행을 위해 현재 값 저장
                            if (rawTitle) lastTitle = rawTitle;
                            if (rawDistributor)
                                lastDistributor = rawDistributor;
                            if (rawRating) lastRating = rawRating;

                            // 모든 필드가 비어있는 행은 스킵
                            if (!title && !rawEpisode && !summary) continue;

                            const errorMessages: string[] = [];

                            // 검증 로직
                            if (!title)
                                errorMessages.push("제목이 누락되었습니다.");
                            if (!rawEpisode)
                                errorMessages.push("회차가 누락되었습니다.");
                            if (!summary || summary.length < 10)
                                errorMessages.push(
                                    "줄거리가 너무 짧거나 누락되었습니다.",
                                );

                            if (hasBadDelimiter(summary)) {
                                errorMessages.push(
                                    "줄거리에 잘못된 구분 기호( / )가 포함되어 있습니다.",
                                );
                            }

                            const episode = parseInt(rawEpisode, 10);
                            if (isNaN(episode)) {
                                errorMessages.push(
                                    "회차는 숫자 형식이어야 합니다.",
                                );
                            }

                            const status: RowStatus =
                                errorMessages.length > 0 ? "error" : "valid";

                            parsedRows.push({
                                id: `row-${i}-${Date.now()}`,
                                seq: i,
                                title,
                                distributor,
                                rating,
                                episode: isNaN(episode) ? 0 : episode,
                                subtitle,
                                runningTime,
                                summary,
                                status,
                                errorMessages,
                            });
                        }

                        resolve(parsedRows);
                    } catch (error) {
                        reject(error);
                    } finally {
                        setIsParsing(false);
                    }
                };

                reader.onerror = () => {
                    setIsParsing(false);
                    reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
                };

                reader.readAsArrayBuffer(file);
            });
        },
        [],
    );

    return { parseExcel, isParsing };
}
