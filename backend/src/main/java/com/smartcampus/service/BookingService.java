package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.dto.RejectRequest;
import com.smartcampus.model.Booking;
import java.util.List;

public interface BookingService {

	List<Booking> getAllBookings();

	Booking createBooking(BookingRequest request);

	Booking approveBooking(String id);

	Booking rejectBooking(String id, RejectRequest request);

	Booking getBookingById(String id);

	void deleteBookingById(String id);
}
