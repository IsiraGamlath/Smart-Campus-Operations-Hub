package backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import backend.dto.CommentRequest;
import backend.dto.TicketRequest;
import backend.dto.TicketResponse;
import backend.model.Ticket;
import backend.model.TicketStatus;
import backend.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    //  CREATE (Updated for Multipart/Form-Data + Base64)
    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponse> create(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam(value = "contact", required = false) String contact,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "image", required = false) MultipartFile image) throws java.io.IOException {
        
        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setPriority(priority);
        ticket.setContact(contact);
        ticket.setLocation(location);
        ticket.setCategory(category);
        
        Ticket created = ticketService.createTicketWithImage(ticket, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(TicketResponse.from(created));
    }

    //  GET COMMENTS BY TICKET ID (Requested fix)
    @GetMapping("/comments/{ticketId}")
    public ResponseEntity<List<backend.model.Comment>> getCommentsByTicketId(@PathVariable String ticketId) {
        return ResponseEntity.ok(ticketService.getTicketById(ticketId).getComments());
    }

    //  GET ALL (Robust Connection Handling)
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAll() {
        try {
            List<TicketResponse> list = ticketService.getAllTickets()
                    .stream()
                    .map(TicketResponse::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            System.err.println("DB ERROR in getAll: " + e.getMessage());
            // Return empty list instead of failing for stability
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    //  GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable String id) {
        try {
            System.out.println("LOG [READ]: Fetching ticket details for ID: " + id);
            return ResponseEntity.ok(TicketResponse.from(ticketService.getTicketById(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found or DB error: " + e.getMessage());
        }
    }

    //  GET COMMENTS BY TICKET ID
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<backend.model.Comment>> getComments(@PathVariable String id) {
        System.out.println("LOG [READ]: Fetching comments for ticket ID: " + id);
        return ResponseEntity.ok(ticketService.getTicketById(id).getComments());
    }

    //  UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(
            @PathVariable String id,
            @Valid @RequestBody TicketRequest request) {
        try {
            Ticket updated = toTicket(request);
            return ResponseEntity.ok(
                    TicketResponse.from(ticketService.updateTicket(id, updated))
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed: " + e.getMessage());
        }
    }

    //  ADD COMMENT
    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addComment(
            @PathVariable String id,
            @RequestBody CommentRequest request) {

        return ResponseEntity.ok(
                TicketResponse.from(ticketService.addComment(id, request.getText()))
        );
    }

    //  DELETE COMMENT (NEW FIX)
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<TicketResponse> deleteComment(
            @PathVariable String id,
            @PathVariable String commentId) {

        return ResponseEntity.ok(
                TicketResponse.from(ticketService.deleteComment(id, commentId))
        );
    }

    //  UPLOAD IMAGES
    @PostMapping("/{id}/upload")
    public ResponseEntity<TicketResponse> uploadImages(
            @PathVariable String id,
            @RequestParam("files") MultipartFile[] files) throws Exception {

        return ResponseEntity.ok(
                TicketResponse.from(ticketService.uploadImages(id, files))
        );
    }

    // DELETE IMAGE
    @DeleteMapping("/{id}/image")
    public ResponseEntity<TicketResponse> deleteImage(
            @PathVariable String id,
            @RequestParam String url) {

        return ResponseEntity.ok(
                TicketResponse.from(ticketService.deleteImage(id, url))
        );
    }

    //  DELETE TICKET
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    //  DTO → ENTITY
    private Ticket toTicket(TicketRequest request) {
        Ticket ticket = new Ticket();

        ticket.setTitle(request.getTitle());
        ticket.setLocation(request.getLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setAssignedTo(request.getAssignedTo());
        ticket.setResolutionNotes(request.getResolutionNotes());
        ticket.setContact(request.getContact());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            ticket.setStatus(TicketStatus.valueOf(request.getStatus().toUpperCase()));
        }

        return ticket;
    }
}