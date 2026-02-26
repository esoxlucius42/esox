import React from 'react';
import styled from 'styled-components';
import NoteCard from './NoteCard';

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #07111f;
  }

  &::-webkit-scrollbar-thumb {
    background: #1a3a6a;
    border-radius: 3px;
  }
`;

const EmptyMessage = styled.div`
  color: #4d7a9e;
  text-align: center;
  padding: 20px;
  font-size: 13px;
`;

export default function NoteList({ notes, selectedNote, onSelectNote, unsavedChanges }) {
  if (notes.length === 0) {
    return (
      <ListContainer>
        <EmptyMessage>No notes yet</EmptyMessage>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          isSelected={selectedNote?.id === note.id}
          onSelect={onSelectNote}
          unsavedChanges={unsavedChanges}
        />
      ))}
    </ListContainer>
  );
}
