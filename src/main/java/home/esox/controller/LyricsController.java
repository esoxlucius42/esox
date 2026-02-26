package home.esox.controller;

import home.esox.entity.Lyrics;
import home.esox.service.LyricsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lyrics")
@Slf4j
@RequiredArgsConstructor
public class LyricsController {

    private final LyricsService lyricsService;

    @GetMapping
    public ResponseEntity<List<Lyrics>> getAllLyrics() {
        log.info("GET /api/lyrics - Fetching all lyrics");
        List<Lyrics> lyrics = lyricsService.getAllLyrics();
        return ResponseEntity.ok(lyrics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lyrics> getLyricsById(@PathVariable Long id) {
        log.info("GET /api/lyrics/{} - Fetching lyrics by id", id);
        return lyricsService.getLyricsById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Lyrics not found with id: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    public ResponseEntity<Lyrics> createLyrics(@RequestBody Lyrics lyrics) {
        log.info("POST /api/lyrics - Creating new lyrics");
        Lyrics created = lyricsService.createLyrics(lyrics);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lyrics> updateLyrics(@PathVariable Long id, @RequestBody Lyrics lyricsDetails) {
        log.info("PUT /api/lyrics/{} - Updating lyrics", id);
        Lyrics updated = lyricsService.updateLyrics(id, lyricsDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLyrics(@PathVariable Long id) {
        log.info("DELETE /api/lyrics/{} - Deleting lyrics", id);
        lyricsService.deleteLyrics(id);
        return ResponseEntity.noContent().build();
    }

}
