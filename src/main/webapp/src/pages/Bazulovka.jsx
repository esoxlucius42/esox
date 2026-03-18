import React, { useState } from 'react';
import styled from 'styled-components';

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

export default function Bazulovka() {
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const toggleDir = () => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));

  return (
    <BazulovkaContainer>
      <CommandBar>
        <AddButton>Add new review</AddButton>
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
      <ContentArea />
    </BazulovkaContainer>
  );
}
