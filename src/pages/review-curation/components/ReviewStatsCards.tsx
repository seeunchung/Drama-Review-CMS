import React from "react";
import { ReviewStats } from "../types/review-curation";

interface Props {
  stats: ReviewStats;
}

export const ReviewStatsCards: React.FC<Props> = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="panel stat-card">
        <span className="stat-label">총 댓글 수</span>
        <span className="stat-value">{stats.totalComments.toLocaleString()}</span>
      </div>
      <div className="panel stat-card danger">
        <span className="stat-label">스포일러 신고</span>
        <span className="stat-value">{stats.spoilerReports.toLocaleString()}</span>
      </div>
      <div className="panel stat-card accent">
        <span className="stat-label">베스트 선정</span>
        <span className="stat-value">{stats.bestSelections.toLocaleString()}</span>
      </div>
    </div>
  );
};
