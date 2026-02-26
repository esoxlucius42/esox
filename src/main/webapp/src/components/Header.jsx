import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background-color: #07111f;
  border-bottom: 1px solid #1a3a6a;
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 52px;
  gap: 4px;
  flex-shrink: 0;
`;

const Logo = styled.span`
  color: #4d9fec;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.05em;
  margin-right: 16px;
`;

const NavButton = styled.button`
  background: ${(props) => (props.active ? '#122540' : 'none')};
  color: ${(props) => (props.active ? '#4d9fec' : '#a0c4e8')};
  border: none;
  border-bottom: 2px solid ${(props) => (props.active ? '#4d9fec' : 'transparent')};
  padding: 0 16px;
  height: 100%;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: color 0.15s, background 0.15s, border-color 0.15s;

  &:hover {
    color: #c8dff5;
    background: #0d1e33;
  }
`;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <HeaderWrapper>
      <Logo>ESOX</Logo>
      <NavButton active={location.pathname === '/apps' || location.pathname === '/'} onClick={() => navigate('/apps')}>
        Apps
      </NavButton>
    </HeaderWrapper>
  );
}
