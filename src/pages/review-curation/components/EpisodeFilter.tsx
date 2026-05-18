import React from "react";

interface Props {
  episodes: number[];
  activeEpisode: number | null;
  onSelect: (episode: number | null) => void;
}

export const EpisodeFilter: React.FC<Props> = ({ episodes, activeEpisode, onSelect }) => {
  return (
    <div className="panel curation-episode-filter">
      <div className="curation-pane-title">회차 필터</div>
      <div className="curation-episode-list">
        <div 
          className={`curation-episode-item ${activeEpisode === null ? 'is-active' : ''}`}
          onClick={() => onSelect(null)}
        >
          전체 회차
        </div>
        {episodes.map(ep => (
          <div 
            key={ep}
            className={`curation-episode-item ${activeEpisode === ep ? 'is-active' : ''}`}
            onClick={() => onSelect(ep)}
          >
            {ep}화
          </div>
        ))}
      </div>
    </div>
  );
};
