package com.smartcampus.controller;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.dto.RejectRequest;
import com.smartcampus.model.Booking;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

	private final BookingService bookingService;
	private final UserRepository userRepository;

	public BookingController(BookingService bookingService, UserRepository userRepository) {
		this.bookingService = bookingService;
		this.userRepository = userRepository;
	}

	@GetMapping
	public ResponseEntity<?> getAllBookings(Authentication authentication) {
		Optional<User> currentUser = resolveCurrentUser(authentication);
		if (currentUser.isEmpty()) {
			return unauthorizedResponse();
		}

		if (currentUser.get().getRole() != Role.ADMIN) {
			return forbiddenResponse();
		}

		return ResponseEntity.ok(bookingService.getAllBookings());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
		return ResponseEntity.ok(bookingService.getBookingById(id));
	}

	@GetMapping("/me")
	public ResponseEntity<?> getMyBookings(Authentication authentication) {
		Optional<User> currentUser = resolveCurrentUser(authentication);
		if (currentUser.isEmpty()) {
			return unauthorizedResponse();
		}

		return ResponseEntity.ok(bookingService.getMyBookings(currentUser.get().getId()));
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<?> getBookingsByUser(@PathVariable String userId, Authentication authentication) {
		Optional<User> currentUser = resolveCurrentUser(authentication);
		if (currentUser.isEmpty()) {
			return unauthorizedResponse();
		}

		if (currentUser.get().getRole() != Role.ADMIN && !currentUser.get().getId().equals(userId)) {
			return forbiddenResponse();
		}

		return ResponseEntity.ok(bookingService.getMyBookings(userId));
	}

	@PostMapping
	public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request, Authentication authentication) {
		Optional<User> currentUser = resolveCurrentUser(authentication);
		if (currentUser.isEmpty()) {
			return unauthorizedResponse();
		}

		Booking createdBooking = bookingService.createBooking(request, currentUser.get().getId());
		return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
	}

	@PutMapping("/{id}/approve")
	public ResponseEntity<Booking> approveBooking(@PathVariable String id) {
		return ResponseEntity.ok(bookingService.approveBooking(id));
	}

	@PutMapping("/{id}/reject")
	public ResponseEntity<Booking> rejectBooking(@PathVariable String id, @Valid @RequestBody RejectRequest request) {
		return ResponseEntity.ok(bookingService.rejectBooking(id, request));
	}

	@PutMapping("/{id}/cancel")
	public ResponseEntity<Booking> cancelBooking(@PathVariable String id) {
		return ResponseEntity.ok(bookingService.cancelBooking(id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBookingById(@PathVariable String id) {
		bookingService.deleteBookingById(id);
		return ResponseEntity.noContent().build();
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

	private ResponseEntity<Map<String, String>> unauthorizedResponse() {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(Map.of("message", "User is not authenticated"));
	}

	private ResponseEntity<Map<String, String>> forbiddenResponse() {
		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body(Map.of("message", "Access denied"));
	}
}
