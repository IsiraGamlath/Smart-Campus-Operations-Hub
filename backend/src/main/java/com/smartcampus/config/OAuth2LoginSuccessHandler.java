package com.smartcampus.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public OAuth2LoginSuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof OAuth2User oAuth2User)) {
            writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid OAuth2 principal");
            return;
        }

        String email = getAttributeAsString(oAuth2User, "email");
        if (email == null || email.isBlank()) {
            writeErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Email not provided by OAuth2 provider");
            return;
        }

        String name = getAttributeAsString(oAuth2User, "name");
        if (name == null || name.isBlank()) {
            name = email;
        }
        String resolvedName = name;

        User user = userRepository.findByEmail(email)
            .orElseGet(() -> userRepository.save(new User(null, resolvedName, email, Role.USER)));

        String redirectUrl = user.getRole() == Role.ADMIN
                ? "http://localhost:3000/admin-dashboard"
                : "http://localhost:3000/dashboard";

        String body = "{"
                + "\"message\":\"OAuth2 login successful\","
                + "\"name\":\"" + escapeJson(resolvedName) + "\","
                + "\"email\":\"" + escapeJson(email) + "\","
            + "\"role\":\"" + user.getRole().name() + "\""
                + "}";

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.sendRedirect(redirectUrl);
        response.getWriter().flush();
    }

    private String getAttributeAsString(OAuth2User user, String key) {
        Object value = user.getAttributes().get(key);
        return value == null ? null : String.valueOf(value);
    }

    private void writeErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("{\"message\":\"" + escapeJson(message) + "\"}");
        response.getWriter().flush();
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
