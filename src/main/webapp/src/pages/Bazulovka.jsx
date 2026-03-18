import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReviewEditor from '../components/ReviewEditor';
import ReviewCard from '../components/ReviewCard';

const BazulovkaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #050d1a;
  color: #c0cfe0;
`;

const CommandBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 44px;
  background-color: #07111f;
  border-bottom: 1px solid #1a3a6a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  box-sizing: border-box;
`;

const AddButton = styled.button`
  background: #122540;
  color: #4d9fec;
  border: 1px solid #1a3a6a;
  border-radius: 4px;
  padding: 0 14px;
  height: 28px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #1a3a6a;
    color: #c8dff5;
  }
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortLabel = styled.span`
  color: #6a90b8;
  font-size: 13px;
`;

const SortSelect = styled.select`
  background: #0d1e33;
  color: #a0c4e8;
  border: 1px solid #1a3a6a;
  border-radius: 4px;
  padding: 0 8px;
  height: 28px;
  font-size: 13px;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: #4d9fec;
  }
`;

const DirButton = styled.button`
  background: #0d1e33;
  color: #a0c4e8;
  border: 1px solid #1a3a6a;
  border-radius: 4px;
  padding: 0 10px;
  height: 28px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  &:hover {
    border-color: #4d9fec;
    color: #c8dff5;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

const EmptyMessage = styled.div`
  color: #3a5a7a;
  font-size: 14px;
  text-align: center;
  margin-top: 60px;
`;

export default function Bazulovka() {
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [reviews, setReviews] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [saveError, setSaveError] = useState(null);

  const toggleDir = () => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) setReviews(await res.json());
    } catch (e) {
      console.error('Failed to fetch reviews', e);
    }
  }

  function openNew() {
    setEditingReview(null);
    setShowEditor(true);
  }

  function openEdit(review) {
    setEditingReview(review);
    setShowEditor(true);
  }

  function closeEditor() {
    setShowEditor(false);
    setEditingReview(null);
  }

  async function handleSave(payload) {
    setSaveError(null);
    try {
      const url = editingReview ? `/api/reviews/${editingReview.id}` : '/api/reviews';
      const method = editingReview ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchReviews();
        closeEditor();
      } else {
        const body = await res.text();
        setSaveError(`Save failed (HTTP ${res.status}): ${body}`);
        console.error('Save failed', res.status, body);
      }
    } catch (e) {
      setSaveError(`Save failed: ${e.message}`);
      console.error('Failed to save review', e);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error('Failed to delete review', e);
    }
  }

  const sorted = [...reviews].sort((a, b) => {
    let av, bv;
    if (sortBy === 'date') {
      av = a.reviewDate ?? '';
      bv = b.reviewDate ?? '';
    } else if (sortBy === 'name') {
      av = (a.title ?? '').toLowerCase();
      bv = (b.title ?? '').toLowerCase();
    } else {
      av = a.totalScore ?? 0;
      bv = b.totalScore ?? 0;
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <BazulovkaContainer>
      {showEditor && (
        <ReviewEditor
          review={editingReview}
          onSave={handleSave}
          onCancel={closeEditor}
          saveError={saveError}
        />
      )}
      <CommandBar>
        <AddButton onClick={openNew}>Add new review</AddButton>
        <SortControls>
          <SortLabel>Sort:</SortLabel>
          <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="score">Score</option>
          </SortSelect>
          <DirButton onClick={toggleDir}>{sortDir === 'asc' ? 'ASC' : 'DESC'}</DirButton>
        </SortControls>
      </CommandBar>
      <ContentArea>
        {sorted.length === 0 ? (
          <EmptyMessage>No reviews yet. Click "Add new review" to get started.</EmptyMessage>
        ) : (
          <ReviewGrid>
            {sorted.map((r) => (
              <ReviewCard key={r.id} review={r} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </ReviewGrid>
        )}
      </ContentArea>
    </BazulovkaContainer>
  );
}
