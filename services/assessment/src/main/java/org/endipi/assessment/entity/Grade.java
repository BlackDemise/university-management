package org.endipi.assessment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.assessment.enums.score.ScoreType;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ScoreType scoreType;

    private Double scoreValue;

    // This field depends on enrollment-service
    // Logic guard properly on this field
    private Long courseRegistrationId;
}
