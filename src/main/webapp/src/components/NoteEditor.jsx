import React from 'react';
import styled from 'styled-components';

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #07111f;
  border: 1px solid #1a3a6a;
  border-radius: 8px;
  overflow: hidden;
`;

const TitleInput = styled.input`
  flex-shrink: 0;
  padding: 16px;
  background-color: #0c1830;
  border: none;
  border-bottom: 1px solid #1a3a6a;
  color: #e2eaf5;
  font-size: 22px;
  font-weight: 700;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-bottom-color: #4d9fec;
  }

  &::placeholder {
    color: #2a5070;
  }
`;

const ContentInput = styled.textarea`
  flex: 1;
  min-height: 0;
  padding: 20px;
  background-color: #0c1830;
  border: none;
  color: #c8dff5;
  font-size: 14px;
  font-family: 'Monaco', 'Courier New', monospace;
  outline: none;
  resize: none;
  line-height: 1.6;

  &::placeholder {
    color: #2a5070;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #0c1830;
  }

  &::-webkit-scrollbar-thumb {
    background: #1a3a6a;
    border-radius: 3px;
  }
`;

const ButtonContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  padding: 16px;
  background-color: #07111f;
  border-top: 1px solid #1a3a6a;
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 10px 20px;
  background: #1a3a6a;
  color: #c8dff5;
  border: 1px solid #2a6ab5;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2a5090;
    border-color: #4d9fec;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 10px 20px;
  background: #2a0d0d;
  color: #e28080;
  border: 1px solid #6a2020;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3d1010;
    border-color: #aa3333;
  }
`;

export default function NoteEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
  unsavedChanges,
}) {
  return (
    <EditorWrapper>
      <TitleInput
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={onTitleChange}
      />
      <ContentInput
        placeholder="Start typing your note here..."
        value={content}
        onChange={onContentChange}
      />
      <ButtonContainer>
        <SaveButton
          onClick={onSave}
          disabled={!unsavedChanges}
          title={unsavedChanges ? 'Save changes (Ctrl+S)' : 'No unsaved changes'}
        >
          Save
        </SaveButton>
        <DeleteButton onClick={onDelete} title="Delete this note">
          Delete
        </DeleteButton>
      </ButtonContainer>
    </EditorWrapper>
  );
}
