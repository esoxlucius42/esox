import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: ${props => props.isSelected ? '#122540' : '#0c1830'};
  border: 1px solid ${props => props.isSelected ? '#2a6ab5' : '#1a3a6a'};
  border-left: 3px solid ${props => props.isSelected ? '#4d9fec' : 'transparent'};
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    background-color: #0f1e35;
    border-color: #2a6ab5;
  }
`;

const Artist = styled.div`
  color: #c8dff5;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
`;

const Title = styled.div`
  color: #5a8ab0;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnsavedIndicator = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  background-color: #4d9fec;
  border-radius: 50%;
`;

export default function LyricsCard({ lyrics, isSelected, onSelect, unsavedChanges }) {
  return (
    <CardContainer
      isSelected={isSelected}
      onClick={() => onSelect(lyrics)}
    >
      {isSelected && unsavedChanges && <UnsavedIndicator title="Unsaved changes" />}
      <Artist>{lyrics.artist || 'Unknown Artist'}</Artist>
      <Title>{lyrics.title || 'Untitled'}</Title>
    </CardContainer>
  );
}
