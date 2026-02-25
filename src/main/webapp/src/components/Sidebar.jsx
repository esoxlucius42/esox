import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarWrapper = styled.aside`
  background-color: #0a0a0a;
  border-right: 2px solid #ff6b00;
  padding: 15px 10px;
  transition: width 0.3s ease;
  width: ${(props) => (props.isCollapsed ? '40px' : '200px')};
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isCollapsed ? 'center' : 'flex-start')};
  min-height: calc(100vh - 80px);
`;

const NavHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
`;

const CollapseButton = styled.button`
  background-color: #ff0000;
  color: #fff;
  border: none;
  width: 24px;
  height: 24px;
  padding: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: background-color 0.2s;
  flex-shrink: 0;

  &:hover {
    background-color: #cc0000;
  }
`;

const NavLabel = styled.span`
  color: #ff6b00;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  display: ${(props) => (props.isCollapsed ? 'none' : 'inline-block')};
`;

const NavItems = styled.nav`
  display: ${(props) => (props.isCollapsed ? 'none' : 'flex')};
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
`;

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarWrapper isCollapsed={isCollapsed}>
      <NavHeader>
        <CollapseButton onClick={toggleCollapse}>
          {isCollapsed ? '→' : '←'}
        </CollapseButton>
        <NavLabel isCollapsed={isCollapsed}>NAVIGATION</NavLabel>
      </NavHeader>
      <NavItems isCollapsed={isCollapsed}>
        {/* Navigation items will be added here */}
      </NavItems>
    </SidebarWrapper>
  );
}
