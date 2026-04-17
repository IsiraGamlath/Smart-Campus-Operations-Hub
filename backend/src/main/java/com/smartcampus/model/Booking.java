package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    
    @Id
    private String id;
    
    private String userId;
    
    private String resourceId;
    
    private LocalDate date;
    
    private LocalTime startTime;
    
    private LocalTime endTime;
    
    private String purpose;
    
    private int attendees;
    
    private BookingStatus status;
    
    private String rejectionReason;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
