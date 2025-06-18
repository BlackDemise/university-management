package org.endipi.auth.service;

public interface BlacklistedTokenService {
    void deleteExpiredTokensAt1AM();
}
