import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Apps from './Apps';
import Notes from './Notes';
import Lyrics from './Lyrics';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  overflow: hidden;
  background-color: #050d1a;
  display: flex;
  flex-direction: column;
`;

export default function Home({ currentPage }) {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {currentPage === 'apps' && <Apps />}
        {currentPage === 'notes' && <Notes />}
        {currentPage === 'lyrics' && <Lyrics />}
      </MainContent>
    </LayoutContainer>
  );
}
