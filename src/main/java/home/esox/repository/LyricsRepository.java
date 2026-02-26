package home.esox.repository;

import home.esox.entity.Lyrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LyricsRepository extends JpaRepository<Lyrics, Long> {

    List<Lyrics> findAllByOrderByArtistAscTitleAsc();

}
