import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  aspect-ratio: 5 / 3;
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
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
    bottom: 0;
    background-color: rgba(255, 107, 0, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #2a2a2a;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);

    &::before {
      opacity: 1;
    }
  }
`;

const CardTitle = styled.h3`
  color: #0099ff;
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px 0;
  position: relative;
  z-index: 1;
`;

const CardSubtitle = styled.p`
  color: #00ffff;
  font-size: 14px;
  margin: 0;
  position: relative;
  z-index: 1;
  line-height: 1.4;
`;

export default function Card({ type, title, subtitle, onClick }) {
  return (
    <CardWrapper onClick={onClick}>
      <CardTitle>{title}</CardTitle>
      <CardSubtitle>{subtitle}</CardSubtitle>
    </CardWrapper>
  );
}
