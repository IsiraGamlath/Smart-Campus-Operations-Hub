package com.smartcampus.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class RejectRequest {
    
    @NotBlank(message = "Rejection reason cannot be blank")
    private String reason;
}
