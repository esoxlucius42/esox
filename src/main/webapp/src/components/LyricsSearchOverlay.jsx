import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: #07111f;
  border: 1px solid #1a3a6a;
  border-radius: 10px;
  width: 700px;
  max-width: 95vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DialogHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #1a3a6a;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DialogTitle = styled.h2`
  margin: 0;
  color: #c8dff5;
  font-size: 16px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #4d7a9e;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  &:hover { color: #c8dff5; }
`;

const SearchForm = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #1a3a6a;
  display: flex;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 9px 12px;
  background: #0c1830;
  border: 1px solid #1a3a6a;
  border-radius: 6px;
  color: #e2eaf5;
  font-size: 14px;
  outline: none;
  &:focus { border-color: #4d9fec; }
  &::placeholder { color: #2a5070; }
`;

const SearchButton = styled.button`
  padding: 9px 18px;
  background: #1a3a6a;
  color: #c8dff5;
  border: 1px solid #2a6ab5;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  &:hover:not(:disabled) { background: #2a5090; border-color: #4d9fec; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
`;

const ResultsPanel = styled.div`
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid #1a3a6a;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: #07111f; }
  &::-webkit-scrollbar-thumb { background: #1a3a6a; border-radius: 3px; }
`;

const ResultItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 1px solid #0e1f3a;
  background: ${props => props.isActive ? '#122540' : 'transparent'};
  border-left: 3px solid ${props => props.isActive ? '#4d9fec' : 'transparent'};
  &:hover { background: #0f1e35; }
`;

const ResultArtist = styled.div`
  color: #c8dff5;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultTitle = styled.div`
  color: #5a8ab0;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

const PreviewPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`;

const PreviewHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #1a3a6a;
  flex-shrink: 0;
`;

const PreviewArtist = styled.div`
  color: #c8dff5;
  font-size: 14px;
  font-weight: 700;
`;

const PreviewTitle = styled.div`
  color: #5a8ab0;
  font-size: 12px;
  margin-top: 2px;
`;

const PreviewLyrics = styled.pre`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin: 0;
  color: #9dbdd8;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: #0c1830; }
  &::-webkit-scrollbar-thumb { background: #1a3a6a; border-radius: 3px; }
`;

const EmptyPreview = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2a5070;
  font-size: 13px;
  padding: 20px;
  text-align: center;
`;

const DialogFooter = styled.div`
  padding: 12px 20px;
  border-top: 1px solid #1a3a6a;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const AcceptButton = styled.button`
  padding: 9px 20px;
  background: #1a3a6a;
  color: #c8dff5;
  border: 1px solid #2a6ab5;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) { background: #2a5090; border-color: #4d9fec; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const CancelButton = styled.button`
  padding: 9px 20px;
  background: transparent;
  color: #7a9ab8;
  border: 1px solid #1a3a6a;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  &:hover { border-color: #4d7a9e; color: #c8dff5; }
`;

const StatusText = styled.div`
  color: #4d7a9e;
  font-size: 12px;
  padding: 20px;
  text-align: center;
`;

export default function LyricsSearchOverlay({ onAccept, onCancel }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchDone(false);
    setResults([]);
    setSelectedResult(null);
    setPreview(null);
    try {
      const res = await fetch(`/api/lyrics/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } finally {
      setSearching(false);
      setSearchDone(true);
    }
  };

  const handleSelectResult = async (result) => {
    setSelectedResult(result);
    setPreview(null);
    setLoadingPreview(true);
    try {
      const res = await fetch(
        `/api/lyrics/search/fetch?artist=${encodeURIComponent(result.artist)}&title=${encodeURIComponent(result.title)}`
      );
      if (res.ok) {
        const data = await res.json();
        setPreview(data);
      } else {
        setPreview({ artist: result.artist, title: result.title, lyrics: null });
      }
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleAccept = () => {
    if (preview && preview.lyrics) {
      onAccept({ artist: preview.artist, title: preview.title, content: preview.lyrics });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Overlay onClick={onCancel}>
      <Dialog onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Search Lyrics Online</DialogTitle>
          <CloseButton onClick={onCancel} title="Close">×</CloseButton>
        </DialogHeader>

        <SearchForm>
          <SearchInput
            placeholder="Artist, song title, or partial name…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <SearchButton onClick={handleSearch} disabled={searching || !query.trim()}>
            {searching ? 'Searching…' : 'Search'}
          </SearchButton>
        </SearchForm>

        <Body>
          <ResultsPanel>
            {searching && <StatusText>Searching…</StatusText>}
            {!searching && searchDone && results.length === 0 && (
              <StatusText>No results found.</StatusText>
            )}
            {results.map((r, i) => (
              <ResultItem
                key={i}
                isActive={selectedResult === r}
                onClick={() => handleSelectResult(r)}
              >
                <ResultArtist>{r.artist}</ResultArtist>
                <ResultTitle>{r.title}</ResultTitle>
              </ResultItem>
            ))}
          </ResultsPanel>

          <PreviewPanel>
            {!selectedResult && (
              <EmptyPreview>
                {searchDone && results.length > 0
                  ? 'Click a result to preview lyrics'
                  : 'Search for a song to see results'}
              </EmptyPreview>
            )}
            {selectedResult && loadingPreview && (
              <EmptyPreview>Loading lyrics…</EmptyPreview>
            )}
            {selectedResult && !loadingPreview && preview && (
              <>
                <PreviewHeader>
                  <PreviewArtist>{preview.artist}</PreviewArtist>
                  <PreviewTitle>{preview.title}</PreviewTitle>
                </PreviewHeader>
                {preview.lyrics
                  ? <PreviewLyrics>{preview.lyrics}</PreviewLyrics>
                  : <EmptyPreview>Lyrics not available for this song.</EmptyPreview>
                }
              </>
            )}
          </PreviewPanel>
        </Body>

        <DialogFooter>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <AcceptButton
            onClick={handleAccept}
            disabled={!preview || !preview.lyrics}
            title={preview && preview.lyrics ? 'Use these lyrics' : 'Select a song with lyrics first'}
          >
            Accept
          </AcceptButton>
        </DialogFooter>
      </Dialog>
    </Overlay>
  );
}
