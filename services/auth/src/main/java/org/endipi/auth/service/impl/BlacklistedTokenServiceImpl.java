package org.endipi.auth.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.auth.repository.BlacklistedTokenRepository;
import org.endipi.auth.service.BlacklistedTokenService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlacklistedTokenServiceImpl implements BlacklistedTokenService {
    private final BlacklistedTokenRepository blacklistedTokenRepository;

    @Override
    @Transactional
    public void deleteExpiredTokensAt1AM() {
        try {
            Instant now = Instant.now();
            int deletedCount = blacklistedTokenRepository.deleteByExpiresAtBefore(now);
            log.info("Cleaned up {} expired blacklisted tokens", deletedCount);
        } catch (Exception e) {
            log.error("Error cleaning up expired tokens", e);
        }
    }
}
