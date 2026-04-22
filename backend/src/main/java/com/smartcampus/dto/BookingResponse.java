package com.smartcampus.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;

import lombok.Data;

@Data
public class BookingResponse {

    private String id;
    private String userId;
    private String userName;
    private String resourceId;
    private String resourceName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private int attendees;
    private BookingStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookingResponse from(Booking booking, String userName, String resourceName) {
        BookingResponse response = new BookingResponse();
        response.id = booking.getId();
        response.userId = booking.getUserId();
        response.userName = userName;
        response.resourceId = booking.getResourceId();
        response.resourceName = resourceName;
        response.date = booking.getDate();
        response.startTime = booking.getStartTime();
        response.endTime = booking.getEndTime();
        response.purpose = booking.getPurpose();
        response.attendees = booking.getAttendees();
        response.status = booking.getStatus();
        response.rejectionReason = booking.getRejectionReason();
        response.createdAt = booking.getCreatedAt();
        response.updatedAt = booking.getUpdatedAt();
        return response;
    }
}
