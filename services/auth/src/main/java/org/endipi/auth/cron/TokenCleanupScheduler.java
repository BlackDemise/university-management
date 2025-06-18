package org.endipi.auth.cron;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.auth.service.BlacklistedTokenService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TokenCleanupScheduler {
    private final BlacklistedTokenService blacklistedTokenService;

    /**
     * Runs every day at 1:00 AM to clean up expired blacklisted tokens
     * This is a good time as it's typically low traffic period
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void cleanupExpiredTokens() {
        log.info("Starting scheduled token cleanup task");
        blacklistedTokenService.deleteExpiredTokensAt1AM();
        log.info("Completed scheduled token cleanup task");
    }
} 