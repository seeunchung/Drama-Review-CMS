import React from "react";

interface Props {
  episodes: number[];
  activeEpisode: number | null;
  onSelect: (episode: number | null) => void;
}

export const EpisodeFilter: React.FC<Props> = ({ episodes, activeEpisode, onSelect }) => {
  return (
    <div className="panel episode-filter">
      <div className="filter-header">회차 필터</div>
      <div className="episode-list">
        <div 
          className={`episode-item ${activeEpisode === null ? 'active' : ''}`}
          onClick={() => onSelect(null)}
        >
          전체 회차
        </div>
        {episodes.map(ep => (
          <div 
            key={ep}
            className={`episode-item ${activeEpisode === ep ? 'active' : ''}`}
            onClick={() => onSelect(ep)}
          >
            {ep}화
          </div>
        ))}
      </div>
    </div>
  );
};
