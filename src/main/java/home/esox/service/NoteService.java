package home.esox.service;

import home.esox.entity.Note;
import home.esox.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;

    public List<Note> getAllNotes() {
        log.info("Fetching all notes");
        return noteRepository.findAll();
    }

    public Optional<Note> getNoteById(Long id) {
        log.info("Fetching note with id: {}", id);
        return noteRepository.findById(id);
    }

    public Note createNote(Note note) {
        log.info("Creating new note with title: {}", note.getTitle());
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, Note noteDetails) {
        log.info("Updating note with id: {}", id);
        return noteRepository.findById(id)
                .map(note -> {
                    note.setTitle(noteDetails.getTitle());
                    note.setContent(noteDetails.getContent());
                    note.setUpdatedAt(LocalDateTime.now());
                    return noteRepository.save(note);
                })
                .orElseThrow(() -> {
                    log.warn("Note not found with id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found with id: " + id);
                });
    }

    public void deleteNote(Long id) {
        log.info("Deleting note with id: {}", id);
        if (!noteRepository.existsById(id)) {
            log.warn("Attempted to delete non-existent note with id: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found with id: " + id);
        }
        noteRepository.deleteById(id);
    }

}
