import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Apps from './Apps';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  background-color: #0a0a0a;
`;

export default function Home({
  sidebarCollapsed,
  setSidebarCollapsed,
  currentPage,
}) {
  return (
    <LayoutContainer>
      <Header />
      <ContentWrapper>
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <MainContent>
          {currentPage === 'apps' && <Apps />}
        </MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
}
