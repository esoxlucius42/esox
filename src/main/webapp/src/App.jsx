import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Home currentPage="apps" />} />
          <Route path="/apps" element={<Home currentPage="apps" />} />
          <Route path="/notes" element={<Home currentPage="notes" />} />
        </Routes>
      </AppContainer>
    </BrowserRouter>
  );
}
