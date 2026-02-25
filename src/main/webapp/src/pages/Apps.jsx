import React from 'react';
import styled from 'styled-components';
import Card from '../components/Card';

const AppsContainer = styled.div`
  padding: 20px;
  background-color: #0a0a0a;
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
};

export default function Apps() {
  const handleNoteCardClick = () => {
    // Navigate to note app
    console.log('Note app clicked');
  };

  return (
    <AppsContainer>
      <AppsGrid>
        <Card
          type={noteApp.type}
          title={noteApp.title}
          subtitle={noteApp.subtitle}
          onClick={handleNoteCardClick}
        />
      </AppsGrid>
    </AppsContainer>
  );
}
