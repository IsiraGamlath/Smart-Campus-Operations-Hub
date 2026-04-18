package backend.dto;

import backend.model.Ticket;
import backend.model.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {

    private String id;
    private String title;
    private String location;
    private String category;
    private String description;
    private TicketStatus status;
    private String priority;
    private List<String> images;
    private String createdBy;
    private String assignedTo;
    private String resolutionNotes;
    private String contact;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TicketResponse from(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.id = ticket.getId();
        response.title = ticket.getTitle();
        response.location = ticket.getLocation();
        response.category = ticket.getCategory();
        response.description = ticket.getDescription();
        response.status = ticket.getStatus();
        response.priority = ticket.getPriority();
        response.images = ticket.getImages();
        response.createdBy = ticket.getCreatedBy();
        response.assignedTo = ticket.getAssignedTo();
        response.resolutionNotes = ticket.getResolutionNotes();
        response.createdAt = ticket.getCreatedAt();
        response.updatedAt = ticket.getUpdatedAt();
        response.contact = ticket.getContact();
        response.image = ticket.getImage();
        return response;
    }

    public String getImage() {
        return image;
    }

    public String getContact() {
        return contact;
    }

    public String getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }
    public String getLocation() {
        return location;
    }
    public String getCategory() {
        return category;
    }
    public String getDescription() {
        return description;
    }
    public TicketStatus getStatus() {
        return status;
    }
    public String getPriority() {
        return priority;
    }
    public List<String> getImages() {
        return images;
    }
    public String getCreatedBy() {
        return createdBy;
    }
    public String getAssignedTo() {
        return assignedTo;
    }
    public String getResolutionNotes() {
        return resolutionNotes;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
