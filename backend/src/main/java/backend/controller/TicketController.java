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

    //  CREATE
    @PostMapping
    public ResponseEntity<TicketResponse> create(@Valid @RequestBody TicketRequest request) {
        Ticket ticket = toTicket(request);
        Ticket created = ticketService.createTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(TicketResponse.from(created));
    }

    //  GET ALL
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAll() {
        List<TicketResponse> list = ticketService.getAllTickets()
                .stream()
                .map(TicketResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    //  GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(TicketResponse.from(ticketService.getTicketById(id)));
    }

    //  UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> update(
            @PathVariable String id,
            @Valid @RequestBody TicketRequest request) {

        Ticket updated = toTicket(request);
        return ResponseEntity.ok(
                TicketResponse.from(ticketService.updateTicket(id, updated))
        );
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

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            ticket.setStatus(TicketStatus.valueOf(request.getStatus().toUpperCase()));
        }

        return ticket;
    }
}