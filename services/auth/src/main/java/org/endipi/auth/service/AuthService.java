package org.endipi.auth.service;

import jakarta.servlet.http.HttpServletResponse;
import org.endipi.auth.dto.request.AuthRequest;
import org.endipi.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(AuthRequest request, HttpServletResponse response);
    void logout(String accessToken, String refreshToken, HttpServletResponse response);
    boolean introspect(String accessToken);
    AuthResponse refresh(String refreshToken, HttpServletResponse response);
}
