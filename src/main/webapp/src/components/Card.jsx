import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  aspect-ratio: 5 / 3;
  background-color: #0c1830;
  border: 1px solid #1a3a6a;
  border-radius: 10px;
  padding: 20px;
  padding-top: 22px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ $accentGradient }) => $accentGradient || 'transparent'};
    border-radius: 10px 10px 0 0;
  }

  &:hover {
    background-color: #102040;
    border-color: #2a6ab5;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(4, 20, 50, 0.5);
  }
`;

const CardTitle = styled.h3`
  color: #c8dff5;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const CardSubtitle = styled.p`
  color: #6a9fc8;
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
`;

export default function Card({ type, title, subtitle, accentGradient, onClick }) {
  return (
    <CardWrapper $accentGradient={accentGradient} onClick={onClick}>
      <CardTitle>{title}</CardTitle>
      <CardSubtitle>{subtitle}</CardSubtitle>
    </CardWrapper>
  );
}
