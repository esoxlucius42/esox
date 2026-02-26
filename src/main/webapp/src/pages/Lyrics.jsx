import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LyricsList from '../components/LyricsList';
import LyricsEditor from '../components/LyricsEditor';

const LyricsContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #050d1a;
`;

const Sidebar = styled.div`
  width: 260px;
  background-color: #07111f;
  border-right: 1px solid #1a3a6a;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
`;

const AddLyricsButton = styled.button`
  background: #1a3a6a;
  color: #c8dff5;
  border: 1px solid #2a6ab5;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 12px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: #2a5090;
    border-color: #4d9fec;
  }
`;

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4d7a9e;
  font-size: 16px;
  text-align: center;
`;

export default function Lyrics() {
  const [lyricsList, setLyricsList] = useState([]);
  const [selectedLyrics, setSelectedLyrics] = useState(null);
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLyrics();
  }, []);

  useEffect(() => {
    if (lyricsList.length > 0 && !selectedLyrics) {
      const lastId = localStorage.getItem('lastLyricsId');
      if (lastId) {
        const last = lyricsList.find(l => l.id === parseInt(lastId));
        if (last) {
          selectLyrics(last);
          return;
        }
      }
      selectLyrics(lyricsList[0]);
    }
    setLoading(false);
  }, [lyricsList]);

  const fetchLyrics = async () => {
    try {
      const response = await fetch('/api/lyrics');
      if (response.ok) {
        const data = await response.json();
        setLyricsList(data);
      }
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    }
  };

  const selectLyrics = (lyrics) => {
    if (unsavedChanges) {
      if (window.confirm('You have unsaved changes. Leave without saving?')) {
        applySelection(lyrics);
      }
    } else {
      applySelection(lyrics);
    }
  };

  const applySelection = (lyrics) => {
    setSelectedLyrics(lyrics);
    setArtist(lyrics.artist || '');
    setTitle(lyrics.title || '');
    setContent(lyrics.content || '');
    setUnsavedChanges(false);
    localStorage.setItem('lastLyricsId', lyrics.id);
  };

  const handleAddLyrics = async () => {
    try {
      const response = await fetch('/api/lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist: 'Unknown Artist', title: 'Untitled', content: '' }),
      });

      if (response.ok) {
        const created = await response.json();
        const updated = [...lyricsList, created].sort((a, b) =>
          a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title)
        );
        setLyricsList(updated);
        selectLyrics(created);
      }
    } catch (error) {
      console.error('Error creating lyrics:', error);
    }
  };

  const handleSaveLyrics = async () => {
    if (!selectedLyrics) return;

    try {
      const response = await fetch(`/api/lyrics/${selectedLyrics.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist, title, content }),
      });

      if (response.ok) {
        const updated = await response.json();
        const updatedList = lyricsList
          .map(l => l.id === updated.id ? updated : l)
          .sort((a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title));
        setLyricsList(updatedList);
        setSelectedLyrics(updated);
        setUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error saving lyrics:', error);
    }
  };

  const handleDeleteLyrics = async () => {
    if (!selectedLyrics) return;

    if (window.confirm('Are you sure you want to delete these lyrics?')) {
      try {
        const response = await fetch(`/api/lyrics/${selectedLyrics.id}`, { method: 'DELETE' });

        if (response.ok) {
          const remaining = lyricsList.filter(l => l.id !== selectedLyrics.id);
          setLyricsList(remaining);
          setSelectedLyrics(null);
          setArtist('');
          setTitle('');
          setContent('');
          setUnsavedChanges(false);

          if (remaining.length > 0) {
            selectLyrics(remaining[0]);
          }
        }
      } catch (error) {
        console.error('Error deleting lyrics:', error);
      }
    }
  };

  if (loading) {
    return <LyricsContainer><EmptyState>Loading lyrics...</EmptyState></LyricsContainer>;
  }

  return (
    <LyricsContainer>
      <Sidebar>
        <AddLyricsButton onClick={handleAddLyrics}>+ Add New Lyrics</AddLyricsButton>
        <LyricsList
          lyricsList={lyricsList}
          selectedLyrics={selectedLyrics}
          onSelectLyrics={selectLyrics}
          unsavedChanges={unsavedChanges}
        />
      </Sidebar>
      <EditorContainer>
        {selectedLyrics ? (
          <LyricsEditor
            artist={artist}
            title={title}
            content={content}
            onArtistChange={e => { setArtist(e.target.value); setUnsavedChanges(true); }}
            onTitleChange={e => { setTitle(e.target.value); setUnsavedChanges(true); }}
            onContentChange={e => { setContent(e.target.value); setUnsavedChanges(true); }}
            onSave={handleSaveLyrics}
            onDelete={handleDeleteLyrics}
            unsavedChanges={unsavedChanges}
          />
        ) : (
          <EmptyState>No lyrics yet. Add one to get started!</EmptyState>
        )}
      </EditorContainer>
    </LyricsContainer>
  );
}
