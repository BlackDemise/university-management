package org.endipi.auth.service.impl;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.endipi.auth.dto.request.AuthRequest;
import org.endipi.auth.dto.response.AuthResponse;
import org.endipi.auth.entity.AuthUser;
import org.endipi.auth.entity.BlacklistedToken;
import org.endipi.auth.enums.error.ErrorCode;
import org.endipi.auth.enums.token.TokenType;
import org.endipi.auth.exception.ApplicationException;
import org.endipi.auth.repository.AuthUserRepository;
import org.endipi.auth.repository.BlacklistedTokenRepository;
import org.endipi.auth.service.AuthService;
import org.endipi.auth.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthUserRepository authUserRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final BlacklistedTokenRepository blacklistedTokenRepository;

    @Override
    public AuthResponse login(AuthRequest request, HttpServletResponse response) {
        if (request == null || request.getEmail() == null || request.getPassword() == null
                || request.getEmail().isEmpty() || request.getPassword().isEmpty()) {
            throw new ApplicationException(ErrorCode.INVALID_LOGIN_REQUEST);
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String email = request.getEmail();
        AuthUser user = authUserRepository.findByEmail(email)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole());

        String accessToken = jwtUtil.generateToken(extraClaims, user, 30000L);
        String refreshToken = jwtUtil.generateToken(user, 604800000L);

        setRefreshTokenCookie(response, refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .build();
    }

    @Override
    public void logout(String accessToken, String refreshToken, HttpServletResponse response) {
        if (accessToken != null) {
            BlacklistedToken blacklistedToken = BlacklistedToken.builder()
                    .token(accessToken)
                    .tokenType(TokenType.ACCESS)
                    .expiryDate(Instant.now().plusSeconds(900)) // 15 minutes
                    .build();
            blacklistedTokenRepository.save(blacklistedToken);
        }

        if (refreshToken != null) {
            BlacklistedToken blacklistedToken = BlacklistedToken.builder()
                    .token(refreshToken)
                    .tokenType(TokenType.REFRESH)
                    .expiryDate(Instant.now().plusSeconds(608400)) // 7 days
                    .build();
            blacklistedTokenRepository.save(blacklistedToken);
        }

        // Remove refresh token cookie
        Cookie deleteCookie = new Cookie("refreshToken", null);
        deleteCookie.setHttpOnly(true);
        deleteCookie.setSecure(false);
        deleteCookie.setPath("/");
        deleteCookie.setMaxAge(0);
        response.addCookie(deleteCookie);
    }

    @Override
    public boolean introspect(String accessToken) {
        return jwtUtil.isTokenValid(accessToken);
    }

    public AuthResponse refresh(String refreshToken, HttpServletResponse response) {
        if (blacklistedTokenRepository.existsByToken(refreshToken) || !jwtUtil.isTokenValid(refreshToken)) {
            throw new JwtException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        AuthUser user = authUserRepository.findByEmail(username)
                .orElseThrow(() -> new ApplicationException(ErrorCode.USER_NOT_FOUND));

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole());

        String newAccessToken = jwtUtil.generateToken(extraClaims, user, 30000L);
        String newRefreshToken = jwtUtil.generateToken(user, 604800000L);

        // Blacklist old refresh token
        blacklistedTokenRepository.save(BlacklistedToken.builder()
                .token(refreshToken)
                .tokenType(TokenType.REFRESH)
                .expiryDate(Instant.now().plusSeconds(604800))
                .build());

        // Set new refresh token in cookie
        setRefreshTokenCookie(response, newRefreshToken);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String newRefreshToken) {
        Cookie newRefreshTokenCookie = new Cookie("refreshToken", newRefreshToken);
        newRefreshTokenCookie.setHttpOnly(true);
        newRefreshTokenCookie.setSecure(false); // Use true for HTTPS
        newRefreshTokenCookie.setPath("/"); // Apply to all paths
        newRefreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days

        response.addCookie(newRefreshTokenCookie);
    }
}
