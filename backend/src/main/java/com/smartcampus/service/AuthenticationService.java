package com.smartcampus.service;

import java.util.Locale;
import java.util.Optional;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;

@Service
public class AuthenticationService {

	private final UserRepository userRepository;

	public AuthenticationService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public boolean isCurrentUserAdmin(Authentication authentication) {
		if (authentication == null
				|| !authentication.isAuthenticated()
				|| authentication instanceof AnonymousAuthenticationToken) {
			return false;
		}

		Optional<String> email = extractEmail(authentication);
		if (email.isEmpty()) {
			return false;
		}

		return userRepository.findByEmail(email.get())
				.map(User::getRole)
				.map(role -> role == Role.ADMIN)
				.orElse(false);
	}

	public Optional<User> updateUserRole(String userId, String roleValue) {
		Role role = Role.valueOf(roleValue.trim().toUpperCase(Locale.ROOT));
		return userRepository.findById(userId)
				.map(user -> {
					user.setRole(role);
					return userRepository.save(user);
				});
	}

	private Optional<String> extractEmail(Authentication authentication) {
		Object principal = authentication.getPrincipal();

		if (principal instanceof OAuth2User oauth2User) {
			Object email = oauth2User.getAttributes().get("email");
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
}
