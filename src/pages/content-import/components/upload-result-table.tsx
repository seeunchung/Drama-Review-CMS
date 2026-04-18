import { StatusBadge } from "./status-badge";
import type { BulkUploadRow } from "../types/content-import";

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
                        <th>콘텐츠 제목</th>
                        <th>배급사</th>
                        <th style={{ width: "120px" }}>관람 등급</th>
                        <th style={{ width: "100px" }}>상태</th>
                        <th>검증 메시지</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="empty-row">
                                검토할 데이터가 없습니다. 파일을 업로드해 주세요.
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr key={row.id} className={`row-${row.status}`}>
                                <td className="cell-seq">{row.seq}</td>
                                <td className="cell-title">
                                    <strong>{row.title}</strong>
                                </td>
                                <td>{row.distributor}</td>
                                <td>{row.rating || <span className="text-error">누락</span>}</td>
                                <td>
                                    <StatusBadge status={row.status} />
                                </td>
                                <td className="cell-error">
                                    {row.errorMessage && (
                                        <span className="error-text">
                                            {row.errorMessage}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
