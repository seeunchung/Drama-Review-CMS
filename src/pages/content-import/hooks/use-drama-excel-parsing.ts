import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import type { BulkUploadRow, RowStatus } from "@/pages/content-import/types/content-import";
import { 
    validateDramaRow, 
    applyDramaCollectionValidation 
} from "@/domain/drama/validator";

type ExcelCell = string | number | boolean | null | undefined;
type ExcelRow = ExcelCell[];

/** 드라마 정보 엑셀 파싱 및 검증 훅 */
export function useDramaExcelParsing() {
    const [isParsing, setIsParsing] = useState(false);

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

                        if (!worksheet) {
                            throw new Error("엑셀 시트를 찾을 수 없습니다.");
                        }

                        // 헤더 포함 전체 데이터를 JSON 배열로 추출
                        const rows = XLSX.utils.sheet_to_json<ExcelRow>(
                            worksheet,
                            { header: 1 },
                        );

                        if (rows.length <= 1) {
                            throw new Error(
                                "파싱된 데이터가 없거나 헤더만 존재합니다.",
                            );
                        }

                        let parsedRows: BulkUploadRow[] = [];
                        let baseTitle = "";
                        let lastTitle = "";
                        let lastDistributor = "";
                        let lastRating = "";

                        // 첫 번째 행(헤더) 제외하고 순회
                        for (let i = 1; i < rows.length; i++) {
                            const row = rows[i];
                            if (!row || row.length === 0) continue;

                            // 1. 데이터 추출
                            const rawTitle = String(row[0] || "").trim();
                            const rawDistributor = String(row[1] || "").trim();
                            const rawRating = String(row[2] || "").trim();
                            const rawEpisode = String(row[3] || "").trim();
                            const subtitle = String(row[4] || "").trim();
                            const runningTime = String(row[5] || "").trim();
                            const summary = String(row[6] || "").trim();

                            // 2. 기준 드라마 제목 설정
                            if (rawTitle && !baseTitle) {
                                baseTitle = rawTitle;
                            }

                            // 3. 병합 셀 처리 (Fill-down)
                            const title = rawTitle || lastTitle;
                            const distributor = rawDistributor || lastDistributor;
                            const rating = rawRating || lastRating;

                            // 4. 다음 행을 위한 값 저장
                            if (rawTitle) lastTitle = rawTitle;
                            if (rawDistributor) lastDistributor = rawDistributor;
                            if (rawRating) lastRating = rawRating;

                            // 빈 행 스킵
                            if (!title && !rawEpisode && !summary) continue;

                            // 5. 개별 필드 검증 (domain/drama/validator 사용)
                            const errorMessages = validateDramaRow({
                                title,
                                baseTitle,
                                rawEpisode,
                                rating,
                                summary,
                                runningTime,
                            });

                            const status: RowStatus = errorMessages.length > 0 ? "error" : "valid";

                            parsedRows.push({
                                id: `row-${i}-${Date.now()}`,
                                seq: i,
                                title,
                                distributor,
                                rating,
                                episode: rawEpisode, // 원본 문자열 그대로 저장
                                subtitle,
                                runningTime,
                                summary,
                                status,
                                errorMessages,
                            });
                        }

                        // 6. 전체 데이터 검증 (회차 연속성 등)
                        const finalRows = applyDramaCollectionValidation(parsedRows);

                        resolve(finalRows);
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
