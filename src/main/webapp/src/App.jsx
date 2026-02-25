import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <AppContainer>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                currentPage="home"
              />
            }
          />
          <Route
            path="/apps"
            element={
              <Home
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                currentPage="apps"
              />
            }
          />
        </Routes>
      </AppContainer>
    </BrowserRouter>
  );
}
