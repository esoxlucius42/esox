import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';

const NotesContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #050d1a;
`;

const Sidebar = styled.div`
  width: 260px;
  background-color: #07111f;
  border-right: 1px solid #1a3a6a;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
`;

const AddNoteButton = styled.button`
  background: #1a3a6a;
  color: #c8dff5;
  border: 1px solid #2a6ab5;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 12px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: #2a5090;
    border-color: #4d9fec;
  }
`;

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4d7a9e;
  font-size: 16px;
  text-align: center;
`;

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch notes from API
  useEffect(() => {
    fetchNotes();
  }, []);

  // Load last opened note
  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      const lastNoteId = localStorage.getItem('lastNoteId');
      if (lastNoteId) {
        const lastNote = notes.find(n => n.id === parseInt(lastNoteId));
        if (lastNote) {
          selectNote(lastNote);
          return;
        }
      }
      selectNote(notes[0]);
    }
    setLoading(false);
  }, [notes]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const selectNote = (note) => {
    if (unsavedChanges) {
      if (window.confirm('You have unsaved changes. Leave without saving?')) {
        setSelectedNote(note);
        setTitle(note.title || '');
        setContent(note.content || '');
        setUnsavedChanges(false);
        localStorage.setItem('lastNoteId', note.id);
      }
    } else {
      setSelectedNote(note);
      setTitle(note.title || '');
      setContent(note.content || '');
      setUnsavedChanges(false);
      localStorage.setItem('lastNoteId', note.id);
    }
  };

  const handleAddNote = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Untitled Note',
          content: '',
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]);
        selectNote(newNote);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;

    try {
      const response = await fetch(`/api/notes/${selectedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
        setSelectedNote(updatedNote);
        setUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;

    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`/api/notes/${selectedNote.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedNotes = notes.filter(n => n.id !== selectedNote.id);
          setNotes(updatedNotes);
          setSelectedNote(null);
          setTitle('');
          setContent('');
          setUnsavedChanges(false);

          if (updatedNotes.length > 0) {
            selectNote(updatedNotes[0]);
          }
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setUnsavedChanges(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setUnsavedChanges(true);
  };

  if (loading) {
    return <NotesContainer><EmptyState>Loading notes...</EmptyState></NotesContainer>;
  }

  return (
    <NotesContainer>
      <Sidebar>
        <AddNoteButton onClick={handleAddNote}>+ Add New Note</AddNoteButton>
        <NoteList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={selectNote}
          unsavedChanges={unsavedChanges}
        />
      </Sidebar>
      <EditorContainer>
        {selectedNote ? (
          <NoteEditor
            title={title}
            content={content}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            unsavedChanges={unsavedChanges}
          />
        ) : (
          <EmptyState>No notes yet. Create one to get started!</EmptyState>
        )}
      </EditorContainer>
    </NotesContainer>
  );
}
