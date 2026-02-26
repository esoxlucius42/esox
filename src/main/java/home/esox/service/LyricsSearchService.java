package home.esox.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import home.esox.entity.LyricsFetchResult;
import home.esox.entity.LyricsSearchResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class LyricsSearchService {

    private static final String SUGGEST_URL = "https://api.lyrics.ovh/suggest/";
    private static final String LYRICS_URL = "https://api.lyrics.ovh/v1/";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<LyricsSearchResult> search(String query) {
        try {
            var encoded = URLEncoder.encode(query, StandardCharsets.UTF_8);
            var request = HttpRequest.newBuilder()
                    .uri(URI.create(SUGGEST_URL + encoded))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("lyrics.ovh suggest status: {}", response.statusCode());

            var root = objectMapper.readTree(response.body());
            var data = root.path("data");
            List<LyricsSearchResult> results = new ArrayList<>();
            if (data.isArray()) {
                for (JsonNode item : data) {
                    var title = item.path("title").asText();
                    var artist = item.path("artist").path("name").asText();
                    if (!title.isBlank() && !artist.isBlank()) {
                        results.add(new LyricsSearchResult(artist, title));
                    }
                }
            }
            return results;
        } catch (Exception e) {
            log.error("Error searching lyrics.ovh: {}", e.getMessage());
            return List.of();
        }
    }

    public Optional<LyricsFetchResult> fetchLyrics(String artist, String title) {
        try {
            var encodedArtist = URLEncoder.encode(artist, StandardCharsets.UTF_8);
            var encodedTitle = URLEncoder.encode(title, StandardCharsets.UTF_8);
            var request = HttpRequest.newBuilder()
                    .uri(URI.create(LYRICS_URL + encodedArtist + "/" + encodedTitle))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("lyrics.ovh fetch status: {} for {}/{}", response.statusCode(), artist, title);

            if (response.statusCode() != 200) {
                return Optional.empty();
            }

            var root = objectMapper.readTree(response.body());
            var lyrics = root.path("lyrics").asText();
            if (lyrics.isBlank()) {
                return Optional.empty();
            }
            return Optional.of(new LyricsFetchResult(artist, title, lyrics));
        } catch (Exception e) {
            log.error("Error fetching lyrics from lyrics.ovh: {}", e.getMessage());
            return Optional.empty();
        }
    }
}
