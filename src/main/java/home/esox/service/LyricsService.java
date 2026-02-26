package home.esox.service;

import home.esox.entity.Lyrics;
import home.esox.repository.LyricsRepository;
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
public class LyricsService {

    private final LyricsRepository lyricsRepository;

    public List<Lyrics> getAllLyrics() {
        log.info("Fetching all lyrics");
        return lyricsRepository.findAllByOrderByArtistAscTitleAsc();
    }

    public Optional<Lyrics> getLyricsById(Long id) {
        log.info("Fetching lyrics with id: {}", id);
        return lyricsRepository.findById(id);
    }

    public Lyrics createLyrics(Lyrics lyrics) {
        log.info("Creating new lyrics for artist: {}, title: {}", lyrics.getArtist(), lyrics.getTitle());
        lyrics.setCreatedAt(LocalDateTime.now());
        lyrics.setUpdatedAt(LocalDateTime.now());
        return lyricsRepository.save(lyrics);
    }

    public Lyrics updateLyrics(Long id, Lyrics lyricsDetails) {
        log.info("Updating lyrics with id: {}", id);
        return lyricsRepository.findById(id)
                .map(lyrics -> {
                    lyrics.setArtist(lyricsDetails.getArtist());
                    lyrics.setTitle(lyricsDetails.getTitle());
                    lyrics.setContent(lyricsDetails.getContent());
                    lyrics.setUpdatedAt(LocalDateTime.now());
                    return lyricsRepository.save(lyrics);
                })
                .orElseThrow(() -> {
                    log.warn("Lyrics not found with id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Lyrics not found with id: " + id);
                });
    }

    public void deleteLyrics(Long id) {
        log.info("Deleting lyrics with id: {}", id);
        if (!lyricsRepository.existsById(id)) {
            log.warn("Attempted to delete non-existent lyrics with id: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lyrics not found with id: " + id);
        }
        lyricsRepository.deleteById(id);
    }

}
