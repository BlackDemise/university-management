package org.endipi.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.auth.enums.token.TokenType;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlacklistedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @Enumerated(EnumType.STRING)
    private TokenType tokenType;

    @Column(nullable = false)
    private Instant expiryDate;
}
