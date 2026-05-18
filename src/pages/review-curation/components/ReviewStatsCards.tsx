import React from "react";
import { ReviewStats } from "../types/review-curation";

interface Props {
  stats: ReviewStats;
}

export const ReviewStatsCards: React.FC<Props> = ({ stats }) => {
  return (
    <div className="curation-stats-grid">
      <div className="panel curation-stat-card">
        <span className="curation-stat-label">총 댓글 수</span>
        <span className="curation-stat-value">{stats.totalComments.toLocaleString()}</span>
      </div>
      <div className="panel curation-stat-card is-danger">
        <span className="curation-stat-label">스포일러 신고</span>
        <span className="curation-stat-value">{stats.spoilerReports.toLocaleString()}</span>
      </div>
      <div className="panel curation-stat-card is-accent">
        <span className="curation-stat-label">베스트 선정</span>
        <span className="curation-stat-value">{stats.bestSelections.toLocaleString()}</span>
      </div>
    </div>
  );
};
