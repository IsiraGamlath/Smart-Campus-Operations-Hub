package com.smartcampus.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.model.Notification;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.NotificationsService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {

    private final NotificationsService notificationsService;
    private final UserRepository userRepository;

    public NotificationsController(NotificationsService notificationsService, UserRepository userRepository) {
        this.notificationsService = notificationsService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getCurrentUserNotifications(Authentication authentication) {
        Optional<User> currentUser = resolveCurrentUser(authentication);
        if (currentUser.isEmpty()) {
            return unauthorizedResponse();
        }

        List<Notification> notifications = notificationsService.getNotificationsByUser(currentUser.get().getId());
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String id, Authentication authentication) {
        Optional<User> currentUser = resolveCurrentUser(authentication);
        if (currentUser.isEmpty()) {
            return unauthorizedResponse();
        }

        String userId = currentUser.get().getId();
        Optional<Notification> ownedNotification = findOwnedNotification(userId, id);
        if (ownedNotification.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Notification not found"));
        }

        return notificationsService.markAsRead(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Notification not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id, Principal principal,
            Authentication authentication) {
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            return unauthorizedResponse();
        }

        Optional<User> currentUser = resolveCurrentUser(authentication);
        if (currentUser.isEmpty()) {
            return unauthorizedResponse();
        }

        String userId = currentUser.get().getId();
        Optional<Notification> ownedNotification = findOwnedNotification(userId, id);
        if (ownedNotification.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Notification not found"));
        }

        notificationsService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    private Optional<Notification> findOwnedNotification(String userId, String notificationId) {
        return notificationsService.getNotificationsByUser(userId).stream()
                .filter(notification -> notificationId.equals(notification.getId()))
                .findFirst();
    }

    private Optional<User> resolveCurrentUser(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }

        Optional<String> email = extractEmail(authentication);
        if (email.isEmpty()) {
            return Optional.empty();
        }

        return userRepository.findByEmail(email.get());
    }

    private Optional<String> extractEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2User oAuth2User) {
            Object email = oAuth2User.getAttributes().get("email");
            return Optional.ofNullable(email).map(String::valueOf);
        }

        if (principal instanceof UserDetails userDetails) {
            return Optional.ofNullable(userDetails.getUsername());
        }

        if (principal instanceof String principalName && !"anonymousUser".equalsIgnoreCase(principalName)) {
            return Optional.of(principalName);
        }

        return Optional.empty();
    }

    private ResponseEntity<Map<String, String>> unauthorizedResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "User is not authenticated"));
    }
}