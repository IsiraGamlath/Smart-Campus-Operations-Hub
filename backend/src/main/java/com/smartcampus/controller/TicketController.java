package com.smartcampus.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.smartcampus.dto.CommentRequest;
import com.smartcampus.dto.TicketRequest;
import com.smartcampus.dto.TicketResponse;
import com.smartcampus.model.Comment;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.TicketStatus;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    public TicketController(TicketService ticketService, UserRepository userRepository) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    //  CREATE (Updated for Multipart/Form-Data + Base64)
    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam(value = "contact", required = false) String contact,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) throws java.io.IOException {

        Optional<User> currentUser = resolveCurrentUser(authentication);
        if (currentUser.isEmpty()) {
            return unauthorizedResponse();
        }

        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setPriority(priority);
        ticket.setContact(contact);
        ticket.setLocation(location);
        ticket.setCategory(category);
        ticket.setCreatedBy(currentUser.get().getId());

        Ticket created = ticketService.createTicketWithImage(ticket, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(TicketResponse.from(created));
    }

    //  GET COMMENTS BY TICKET ID (Requested fix)
    @GetMapping("/comments/{ticketId}")
    public ResponseEntity<List<Comment>> getCommentsByTicketId(@PathVariable String ticketId) {
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

    @GetMapping("/me")
    public ResponseEntity<?> getMyTickets(Authentication authentication) {
        Optional<User> currentUser = resolveCurrentUser(authentication);
        if (currentUser.isEmpty()) {
            return unauthorizedResponse();
        }

        List<TicketResponse> list = ticketService.getTicketsByCreator(currentUser.get().getId())
                .stream()
                .map(TicketResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
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
    public ResponseEntity<List<Comment>> getComments(@PathVariable String id) {
        System.out.println("LOG [READ]: Fetching comments for ticket ID: " + id);
        return ResponseEntity.ok(ticketService.getTicketById(id).getComments());
    }

    //  UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(
            @PathVariable String id,
            @RequestBody TicketRequest request) {
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

    //  DTO -> ENTITY
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

    private Optional<User> resolveCurrentUser(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }

        Optional<String> email = extractEmail(authentication);
        if (email.isEmpty()) {
            return Optional.empty();
        }

        return userRepository.findByEmail(email.get());
    }

    private Optional<String> extractEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2User oauth2User) {
            Object email = oauth2User.getAttributes().get("email");
            return Optional.ofNullable(email).map(String::valueOf);
        }

        if (principal instanceof UserDetails userDetails) {
            return Optional.ofNullable(userDetails.getUsername());
        }

        if (principal instanceof String principalName && !"anonymousUser".equalsIgnoreCase(principalName)) {
            return Optional.of(principalName);
        }

        return Optional.empty();
    }

    private ResponseEntity<Map<String, String>> unauthorizedResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "User is not authenticated"));
    }
}
