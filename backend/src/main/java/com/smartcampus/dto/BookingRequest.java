package com.smartcampus.dto;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookingRequest {

    @NotBlank(message = "Resource ID cannot be blank")
    private String resourceId;
    
    @NotNull(message = "Date cannot be null")
    private LocalDate date;
    
    @NotNull(message = "Start time cannot be null")
    private LocalTime startTime;
    
    @NotNull(message = "End time cannot be null")
    private LocalTime endTime;
    
    @NotBlank(message = "Purpose cannot be blank")
    private String purpose;
    
    @Min(value = 1, message = "Attendees must be at least 1")
    private int attendees;
}
