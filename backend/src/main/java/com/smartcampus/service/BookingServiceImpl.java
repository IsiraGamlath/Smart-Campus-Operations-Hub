package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.dto.RejectRequest;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.model.Resource;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationsService notificationsService;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            ResourceRepository resourceRepository,
            NotificationsService notificationsService) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.notificationsService = notificationsService;
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public Booking createBooking(BookingRequest request, String userId) {
        validateTimeRange(request);

        if (userId == null || userId.isBlank()) {
            throw new BadRequestException("User identity is required");
        }

        Resource resource = resourceRepository.findById(request.getResourceId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Resource not found with id: " + request.getResourceId()));

        validateResourceAvailabilityWindow(resource, request.getStartTime(), request.getEndTime());

        if (hasConflict(
                request.getResourceId(),
                request.getDate(),
                request.getStartTime(),
                request.getEndTime())) {
            throw new BadRequestException("Time slot conflicts with an approved booking");
        }

        LocalDateTime now = LocalDateTime.now();

        Booking booking = new Booking();
        booking.setUserId(userId);
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

    @Override
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
        Booking approvedBooking = bookingRepository.save(booking);

        notificationsService.createNotification(
            approvedBooking.getUserId(),
            "Booking approved: " + formatBookingSummary(approvedBooking));

        autoRejectConflictingPendingBookings(approvedBooking);

        return approvedBooking;
    }

    @Override
    public Booking rejectBooking(String id, RejectRequest request) {
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
        booking.setRejectionReason(request.getReason());
        booking.setUpdatedAt(LocalDateTime.now());
        Booking rejectedBooking = bookingRepository.save(booking);

        notificationsService.createNotification(
            rejectedBooking.getUserId(),
            buildRejectionMessage(rejectedBooking));

        return rejectedBooking;
    }

    @Override
    public Booking cancelBooking(String id) {
        Booking booking = getBookingById(id);

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
            throw new BadRequestException("Only pending or approved bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    @Override
    public void deleteBookingById(String id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }

    private void validateTimeRange(BookingRequest request) {
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }
    }

    private void validateResourceAvailabilityWindow(Resource resource, LocalTime bookingStart, LocalTime bookingEnd) {
        LocalTime availableStart;
        LocalTime availableEnd;

        try {
            availableStart = LocalTime.parse(resource.getAvailabilityStart());
            availableEnd = LocalTime.parse(resource.getAvailabilityEnd());
        } catch (DateTimeParseException | NullPointerException ex) {
            throw new BadRequestException("Resource availability window is invalid");
        }

        if (!isWithinAvailability(bookingStart, bookingEnd, availableStart, availableEnd)) {
            throw new BadRequestException("Booking is outside resource availability window");
        }
    }

    private boolean isWithinAvailability(
            LocalTime start,
            LocalTime end,
            LocalTime availableStart,
            LocalTime availableEnd) {
        return !start.isBefore(availableStart) && !end.isAfter(availableEnd);
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

    private void autoRejectConflictingPendingBookings(Booking approvedBooking) {
        List<Booking> sameDayBookings = bookingRepository.findByResourceIdAndDate(
                approvedBooking.getResourceId(),
                approvedBooking.getDate());

        List<Booking> toReject = new ArrayList<>();

        for (Booking existing : sameDayBookings) {
            if (approvedBooking.getId().equals(existing.getId())) {
                continue;
            }

            if (existing.getStatus() != BookingStatus.PENDING) {
                continue;
            }

            boolean isOverlapping = approvedBooking.getStartTime().isBefore(existing.getEndTime())
                    && approvedBooking.getEndTime().isAfter(existing.getStartTime());

            if (isOverlapping) {
                existing.setStatus(BookingStatus.REJECTED);
                existing.setRejectionReason("Auto-rejected due to time conflict with an approved booking");
                existing.setUpdatedAt(LocalDateTime.now());
                toReject.add(existing);
            }
        }

        if (!toReject.isEmpty()) {
            bookingRepository.saveAll(toReject);
            for (Booking rejected : toReject) {
                notificationsService.createNotification(
                        rejected.getUserId(),
                        "Booking auto-rejected: " + formatBookingSummary(rejected)
                                + ". Reason: Time conflict with an approved booking.");
            }
        }
    }

    private String formatBookingSummary(Booking booking) {
        return "Resource " + booking.getResourceId()
                + " on " + booking.getDate()
                + " (" + booking.getStartTime() + "-" + booking.getEndTime() + ")";
    }

    private String buildRejectionMessage(Booking booking) {
        String summary = formatBookingSummary(booking);
        String reason = booking.getRejectionReason();
        if (reason == null || reason.isBlank()) {
            return "Booking rejected: " + summary;
        }
        return "Booking rejected: " + summary + ". Reason: " + reason.trim();
    }
}
