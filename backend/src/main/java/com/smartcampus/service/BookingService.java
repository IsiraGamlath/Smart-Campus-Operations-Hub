package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

	private final BookingRepository bookingRepository;

	public BookingService(BookingRepository bookingRepository) {
		this.bookingRepository = bookingRepository;
	}

	public Booking createBooking(BookingRequest request) {
		validateTimeRange(request);

		if (hasConflict(
				request.getResourceId(),
				request.getDate(),
				request.getStartTime(),
				request.getEndTime())) {
			throw new BadRequestException("Time slot conflicts with an approved booking");
		}

		LocalDateTime now = LocalDateTime.now();

		Booking booking = new Booking();
		booking.setUserId(request.getUserId());
		booking.setResourceId(request.getResourceId());
		booking.setDate(request.getDate());
		booking.setStartTime(request.getStartTime());
		booking.setEndTime(request.getEndTime());
		booking.setPurpose(request.getPurpose());
		booking.setAttendees(request.getAttendees());
		booking.setStatus(BookingStatus.PENDING);
		booking.setRejectionReason(null);
		booking.setCreatedAt(now);
		booking.setUpdatedAt(now);

		return bookingRepository.save(booking);
	}

	public List<Booking> getMyBookings(String userId) {
		return bookingRepository.findByUserId(userId);
	}

	public List<Booking> getAllBookings() {
		return bookingRepository.findAll();
	}

	public Booking approveBooking(String id) {
		Booking booking = getBookingById(id);

		if (booking.getStatus() == BookingStatus.APPROVED) {
			throw new BadRequestException("Booking is already approved");
		}
		if (booking.getStatus() == BookingStatus.REJECTED) {
			throw new BadRequestException("Rejected booking cannot be approved");
		}
		if (booking.getStatus() == BookingStatus.CANCELLED) {
			throw new BadRequestException("Cancelled booking cannot be approved");
		}

		if (hasConflict(
				booking.getResourceId(),
				booking.getDate(),
				booking.getStartTime(),
				booking.getEndTime(),
				booking.getId())) {
			throw new BadRequestException("Time slot conflicts with an approved booking");
		}

		booking.setStatus(BookingStatus.APPROVED);
		booking.setRejectionReason(null);
		booking.setUpdatedAt(LocalDateTime.now());
		return bookingRepository.save(booking);
	}

	public Booking rejectBooking(String id, String reason) {
		Booking booking = getBookingById(id);

		if (booking.getStatus() == BookingStatus.REJECTED) {
			throw new BadRequestException("Booking is already rejected");
		}
		if (booking.getStatus() == BookingStatus.APPROVED) {
			throw new BadRequestException("Approved booking cannot be rejected");
		}
		if (booking.getStatus() == BookingStatus.CANCELLED) {
			throw new BadRequestException("Cancelled booking cannot be rejected");
		}

		booking.setStatus(BookingStatus.REJECTED);
		booking.setRejectionReason(reason);
		booking.setUpdatedAt(LocalDateTime.now());
		return bookingRepository.save(booking);
	}

	public Booking cancelBooking(String id) {
		Booking booking = getBookingById(id);

		if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
			throw new BadRequestException("Only pending or approved bookings can be cancelled");
		}

		booking.setStatus(BookingStatus.CANCELLED);
		booking.setUpdatedAt(LocalDateTime.now());
		return bookingRepository.save(booking);
	}

	private Booking getBookingById(String id) {
		return bookingRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
	}

	private void validateTimeRange(BookingRequest request) {
		if (!request.getEndTime().isAfter(request.getStartTime())) {
			throw new BadRequestException("End time must be after start time");
		}
	}

	private boolean hasConflict(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime) {
		return hasConflict(resourceId, date, startTime, endTime, null);
	}

	private boolean hasConflict(
			String resourceId,
			LocalDate date,
			LocalTime startTime,
			LocalTime endTime,
			String excludeBookingId) {

		List<Booking> bookings = bookingRepository.findByResourceIdAndDate(resourceId, date);

		for (Booking existing : bookings) {
			if (excludeBookingId != null && excludeBookingId.equals(existing.getId())) {
				continue;
			}

			if (existing.getStatus() != BookingStatus.APPROVED) {
				continue;
			}

			boolean isOverlapping = startTime.isBefore(existing.getEndTime())
					&& endTime.isAfter(existing.getStartTime());

			if (isOverlapping) {
				return true;
			}
		}

		return false;
	}
}
