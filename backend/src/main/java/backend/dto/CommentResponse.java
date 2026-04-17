package backend.dto;

import backend.model.Comment;

import java.time.LocalDateTime;

public class CommentResponse {

    private String id;
    private String ticketId;
    private String userId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentResponse from(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.id = comment.getId();
        response.ticketId = comment.getTicketId();
        response.userId = comment.getUserId();
        response.content = comment.getContent();
        response.createdAt = comment.getCreatedAt();
        response.updatedAt = comment.getUpdatedAt();
        return response;
    }

    public String getId() {
        return id;
    }
    public String getTicketId() {
        return ticketId;
    }
    public String getUserId() {
        return userId;
    }
    public String getContent() {
        return content;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
