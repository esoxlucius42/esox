package home.esox.service;

import home.esox.entity.Review;
import home.esox.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> getAllReviews() {
        log.info("Fetching all reviews");
        return reviewRepository.findAll();
    }

    public Optional<Review> getReviewById(Long id) {
        log.info("Fetching review with id: {}", id);
        return reviewRepository.findById(id);
    }

    public Review createReview(Review review) {
        log.info("Creating new review with title: {}", review.getTitle());
        var now = LocalDateTime.now();
        review.setReviewDate(LocalDate.now());
        review.setTotalScore(calculateTotalScore(review));
        review.setCreatedAt(now);
        review.setUpdatedAt(now);
        return reviewRepository.save(review);
    }

    public Review updateReview(Long id, Review reviewDetails) {
        log.info("Updating review with id: {}", id);
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setTitle(reviewDetails.getTitle());
                    review.setImageData(reviewDetails.getImageData());
                    review.setTasteAsIs(reviewDetails.getTasteAsIs());
                    review.setTasteAfterCook(reviewDetails.getTasteAfterCook());
                    review.setSoftness(reviewDetails.getSoftness());
                    review.setCooked(reviewDetails.getCooked());
                    review.setSauce(reviewDetails.getSauce());
                    review.setWouldBuyAgain(reviewDetails.getWouldBuyAgain());
                    review.setTotalScore(calculateTotalScore(reviewDetails));
                    review.setUpdatedAt(LocalDateTime.now());
                    return reviewRepository.save(review);
                })
                .orElseThrow(() -> {
                    log.warn("Review not found with id: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with id: " + id);
                });
    }

    public void deleteReview(Long id) {
        log.info("Deleting review with id: {}", id);
        if (!reviewRepository.existsById(id)) {
            log.warn("Attempted to delete non-existent review with id: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    private int calculateTotalScore(Review review) {
        return toInt(review.getTasteAsIs())
                + toInt(review.getTasteAfterCook())
                + toInt(review.getSoftness())
                + toInt(review.getCooked())
                + toInt(review.getSauce());
    }

    private int toInt(Integer value) {
        return value != null ? value : 0;
    }

}
