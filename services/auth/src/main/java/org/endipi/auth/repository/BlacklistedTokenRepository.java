package org.endipi.auth.repository;

import org.endipi.auth.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {
    boolean existsByToken(String token);

    @Modifying
    @Query("DELETE FROM BlacklistedToken b WHERE b.expiryDate < ?1")
    int deleteByExpiresAtBefore(Instant instant);
}
