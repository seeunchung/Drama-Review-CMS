import { StatusBadge } from "./StatusBadge";
import type { BulkUploadRow } from "@/pages/content-import/types/content-import";

interface Props {
    rows: BulkUploadRow[];
}

export function UploadResultTable({ rows }: Props) {
    return (
        <div className="upload-result-table panel">
            <table>
                <thead>
                    <tr>
                        <th style={{ width: "60px" }}>순번</th>
                        <th>제목 (드라마)</th>
                        <th>OTT / 등급</th>
                        <th style={{ width: "80px" }}>회차</th>
                        <th>부제목</th>
                        <th>줄거리</th>
                        <th style={{ width: "100px" }}>러닝타임</th>
                        <th style={{ width: "100px" }}>상태</th>
                        <th>검증 메시지</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="empty-row">
                                검토할 데이터가 없습니다. 파일을 업로드해
                                주세요.
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr key={row.id} className={`row-${row.status}`}>
                                <td className="cell-seq">{row.seq}</td>
                                <td className="cell-title">
                                    <strong>{row.title}</strong>
                                </td>
                                <td>
                                    <div className="cell-sub-info">
                                        <span>{row.distributor}</span>
                                        <span className="badge-rating">
                                            {row.rating}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    {row.episode}
                                </td>
                                <td>{row.subtitle}</td>
                                <td className="cell-summary upload-result-table">
                                    <div
                                        className="summary-text"
                                        title={row.summary}
                                    >
                                        {row.summary}
                                    </div>
                                </td>
                                <td>{row.runningTime}</td>
                                <td>
                                    <StatusBadge status={row.status} />
                                </td>
                                <td className="cell-error">
                                    {row.errorMessages.map((msg, idx) => (
                                        <div key={idx} className="error-text">
                                            • {msg}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
