package home.esox.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bazul_review")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String imageData;

    private Integer tasteAsIs;
    private Integer tasteAfterCook;
    private Integer softness;
    private Integer cooked;
    private Integer sauce;
    private Boolean wouldBuyAgain;
    private Integer totalScore;
    private LocalDate reviewDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
