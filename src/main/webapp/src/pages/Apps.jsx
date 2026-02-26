import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/Card';

const AppsContainer = styled.div`
  padding: 24px;
  background-color: #050d1a;
  min-height: 100%;
`;

const AppsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
`;

const noteApp = {
  type: 'app',
  title: 'Note',
  subtitle: 'Capture ideas instantly',
  accentGradient: 'linear-gradient(90deg, #a03868 0%, #f072a8 50%, #a03868 100%)',
};

export default function Apps() {
  const navigate = useNavigate();

  const handleNoteCardClick = () => {
    navigate('/notes');
  };

  return (
    <AppsContainer>
      <AppsGrid>
        <Card
          type={noteApp.type}
          title={noteApp.title}
          subtitle={noteApp.subtitle}
          accentGradient={noteApp.accentGradient}
          onClick={handleNoteCardClick}
        />
      </AppsGrid>
    </AppsContainer>
  );
}
