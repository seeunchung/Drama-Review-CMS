import { StatusBadge } from "./StatusBadge"
import { StandardEpisode } from "@/domain/drama/types";

interface Props {
    rows: StandardEpisode[];
    emptyMessage?: string;
}

export function EpisodeReviewTable({ 
    rows, 
    emptyMessage = "검토할 데이터가 없습니다." 
}: Props) {
    return (
        <div className="episode-review-table panel">
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
                            <td
                                colSpan={9}
                                className="episode-review-table__empty-row"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr
                                key={row.id}
                                className={
                                    row.status === "error"
                                        ? "episode-review-table__row--error"
                                        : row.status === "uploaded"
                                          ? "episode-review-table__row--uploaded"
                                          : undefined
                                }
                            >
                                <td className="episode-review-table__seq">
                                    {row.seq}
                                </td>
                                <td className="episode-review-table__title">
                                    <strong>{row.title}</strong>
                                </td>
                                <td>
                                    <div className="episode-review-table__sub-info">
                                        <span>{row.distributor}</span>
                                        <span className="episode-review-table__rating">
                                            {row.rating}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    {row.episode}
                                </td>
                                <td>{row.subtitle}</td>
                                <td className="episode-review-table__summary">
                                    <div
                                        className="episode-review-table__summary-text"
                                        title={row.summary}
                                    >
                                        {row.summary}
                                    </div>
                                </td>
                                <td>{row.runningTime}</td>
                                <td>
                                    <StatusBadge status={row.status} />
                                </td>
                                <td className="episode-review-table__errors">
                                    {row.errorMessages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className="episode-review-table__error-text"
                                        >
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
