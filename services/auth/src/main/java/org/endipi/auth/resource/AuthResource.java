package org.endipi.auth.resource;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.endipi.auth.dto.request.AuthRequest;
import org.endipi.auth.dto.response.AuthResponse;
import org.endipi.auth.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthResource {
    private final AuthService authenticationService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody(required = false) AuthRequest authRequest, HttpServletResponse response) {
        return authenticationService.login(authRequest, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader,
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        String accessToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            accessToken = authorizationHeader.substring(7);
        }

        authenticationService.logout(accessToken, refreshToken, response);
        return ResponseEntity.ok().body(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/introspect")
    public ResponseEntity<?> introspect(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        String accessToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            accessToken = authorizationHeader.substring(7);
        }

        boolean isValid = authenticationService.introspect(accessToken);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                     HttpServletResponse response) {
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Refresh token missing"));
        }

        return ResponseEntity.ok(authenticationService.refresh(refreshToken, response));
    }
}