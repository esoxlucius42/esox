package home.esox.service;

import home.esox.entity.LyricsFetchResult;
import home.esox.entity.LyricsSearchResult;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLDecoder;
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
public class LyricsSearchService {

    private static final String DDG_URL = "https://html.duckduckgo.com/html/";
    private static final String USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public List<LyricsSearchResult> search(String query) {
        try {
            var doc = Jsoup.parse(ddgPost(query + " lyrics"));
            List<LyricsSearchResult> results = new ArrayList<>();
            for (var link : doc.select(".result__a")) {
                var parsed = parseArtistTitle(link.text());
                if (parsed != null && !results.contains(parsed)) results.add(parsed);
            }
            log.info("DuckDuckGo search returned {} results for query: {}", results.size(), query);
            return results;
        } catch (Exception e) {
            log.error("DuckDuckGo search error: {}", e.getMessage());
            return List.of();
        }
    }

    public Optional<LyricsFetchResult> fetchLyrics(String artist, String title) {
        // Try site-specific search first, then open search
        String lyricsUrl = findLyricsUrl(artist + " " + title + " lyrics site:azlyrics.com");
        if (lyricsUrl == null) lyricsUrl = findLyricsUrl(artist + " " + title + " lyrics");
        if (lyricsUrl == null) {
            log.warn("No lyrics page found for {}/{}", artist, title);
            return Optional.empty();
        }
        return scrapeLyrics(lyricsUrl, artist, title);
    }

    private String ddgPost(String query) throws Exception {
        var body = "q=" + URLEncoder.encode(query, StandardCharsets.UTF_8);
        var request = HttpRequest.newBuilder()
                .uri(URI.create(DDG_URL))
                .header("User-Agent", USER_AGENT)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        return httpClient.send(request, HttpResponse.BodyHandlers.ofString()).body();
    }

    private String findLyricsUrl(String query) {
        try {
            var doc = Jsoup.parse(ddgPost(query));
            List<String> urls = new ArrayList<>();
            for (var link : doc.select(".result__a")) {
                var url = extractRealUrl(link);
                if (url != null) urls.add(url);
            }
            for (var site : List.of("songlyrics.com", "lyricsfreak.com", "lyrics.com", "azlyrics.com", "genius.com")) {
                for (var url : urls) {
                    if (url.contains(site)) return url;
                }
            }
            return null;
        } catch (Exception e) {
            log.error("DuckDuckGo URL search error: {}", e.getMessage());
            return null;
        }
    }

    private String extractRealUrl(Element link) {
        var href = link.attr("href");
        if (href.isBlank()) return null;
        if (href.startsWith("http://") || href.startsWith("https://")) return href;
        try {
            var fullHref = href.startsWith("//") ? "https:" + href : href;
            var query = new URI(fullHref).getQuery();
            if (query == null) return null;
            for (var param : query.split("&")) {
                if (param.startsWith("uddg=")) {
                    return URLDecoder.decode(param.substring(5), StandardCharsets.UTF_8);
                }
            }
        } catch (Exception e) {
            log.debug("Could not parse URL from href: {}", href);
        }
        return null;
    }

    /** Parses titles like "Artist - Song Title Lyrics | AZLyrics.com" into artist/title pairs. */
    private LyricsSearchResult parseArtistTitle(String raw) {
        if (raw == null || raw.isBlank()) return null;
        var cleaned = raw
                .replaceAll("(?i)\\s*[|]\\s*(AZLyrics|Genius|Lyrics\\.com|MetroLyrics|SongLyrics|LyricFind|Musixmatch|Letras|LyricsFreak|eLyrics|Songfacts|SongMeanings|Lyrics On Demand|lyricsmode).*$", "")
                .replaceAll("(?i)\\s+-\\s+(AZLyrics|Genius|Lyrics\\.com|MetroLyrics|SongLyrics|LyricFind|Musixmatch|Letras|LyricsFreak|eLyrics\\.net|Songfacts|SongMeanings|Lyrics On Demand).*$", "")
                .replaceAll("(?i)\\s*[-|]\\s*(YouTube|Spotify|SoundCloud|Apple Music|Dailymotion).*$", "")
                .replaceAll("(?i)\\s+Lyrics(\\s+&.*)?\\s*$", "")
                .replaceAll("(?i)\\s*\\(Lyrics[^)]*\\)\\s*", " ")
                .replaceAll("\\s*\\[[^\\]]{0,30}\\]\\s*", " ")
                .replaceAll("[.,:;]+$", "")
                .trim();
        var parts = cleaned.split("\\s+[-–—]\\s+", 2);
        if (parts.length != 2) return null;
        var artist = parts[0].trim();
        var title = parts[1].trim();
        if (artist.isBlank() || title.isBlank()) return null;
        if (artist.matches("(?i).*\\blyrics\\b.*") || artist.length() > 60 || title.length() > 80) return null;
        return new LyricsSearchResult(artist, title);
    }

    private Optional<LyricsFetchResult> scrapeLyrics(String url, String artist, String title) {
        try {
            var doc = Jsoup.connect(url).userAgent(USER_AGENT).timeout(10_000).get();
            String lyrics = null;
            if (url.contains("songlyrics.com")) {
                var el = doc.selectFirst(".songLyricsV14");
                if (el != null) lyrics = el.wholeText().strip();
            } else if (url.contains("lyricsfreak.com")) {
                var el = doc.selectFirst("#content");
                if (el != null) lyrics = el.wholeText().strip();
            } else if (url.contains("lyrics.com")) {
                var el = doc.selectFirst(".lyric-body");
                if (el != null) lyrics = el.wholeText().strip();
            } else if (url.contains("azlyrics.com")) {
                var divs = doc.select(".col-xs-12.col-lg-8.text-center div:not([class]):not([id])");
                if (!divs.isEmpty()) lyrics = divs.first().wholeText().strip();
            } else if (url.contains("genius.com")) {
                var containers = doc.select("[data-lyrics-container=true]");
                if (!containers.isEmpty()) {
                    var sb = new StringBuilder();
                    containers.stream()
                            .filter(el -> !el.wholeText().isBlank())
                            .skip(1)
                            .forEach(el -> sb.append(el.wholeText()).append("\n"));
                    lyrics = sb.toString().strip();
                }
            }
            if (lyrics == null || lyrics.isBlank()) {
                log.warn("Could not extract lyrics from {}", url);
                return Optional.empty();
            }
            return Optional.of(new LyricsFetchResult(artist, title, lyrics));
        } catch (Exception e) {
            log.error("Error scraping lyrics from {}: {}", url, e.getMessage());
            return Optional.empty();
        }
    }
}
