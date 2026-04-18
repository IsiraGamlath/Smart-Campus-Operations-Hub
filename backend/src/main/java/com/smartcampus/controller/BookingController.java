package com.smartcampus.controller;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.dto.RejectRequest;
import com.smartcampus.model.Booking;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	@GetMapping
	public ResponseEntity<List<Booking>> getAllBookings() {
		return ResponseEntity.ok(bookingService.getAllBookings());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
		return ResponseEntity.ok(bookingService.getBookingById(id));
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Booking>> getMyBookings(@PathVariable String userId) {
		return ResponseEntity.ok(bookingService.getMyBookings(userId));
	}

	@PostMapping
	public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request) {
		Booking createdBooking = bookingService.createBooking(request);
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
}
