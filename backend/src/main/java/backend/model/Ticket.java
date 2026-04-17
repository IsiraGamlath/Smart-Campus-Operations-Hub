package backend.model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    // ENUM (keep this)
    private TicketStatus status = TicketStatus.OPEN;

    @NotBlank(message = "Priority is required")
    private String priority;

    //  NEW: COMMENTS
    private List<String> comments;

    // NEW: IMAGES
    private List<String> images;

    //  DEFAULT CONSTRUCTOR
    public Ticket() {
        this.status = TicketStatus.OPEN;
    }

    //  CONSTRUCTOR
    public Ticket(String title, String description, TicketStatus status, String priority) {
        this.title = title;
        this.description = description;
        this.status = status == null ? TicketStatus.OPEN : status;
        this.priority = priority;
    }

    //  GETTERS & SETTERS

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status == null ? TicketStatus.OPEN : status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    //  COMMENTS GET/SET
    public List<String> getComments() {
        return comments;
    }

    public void setComments(List<String> comments) {
        this.comments = comments;
    }

    //  IMAGES GET/SET
    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}