package backend.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; //  IMPORT

import backend.model.Ticket;
import backend.model.CommentRequest;
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
    public ResponseEntity<Ticket> create(@Valid @RequestBody Ticket ticket) {
        Ticket createdTicket = ticketService.createTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }

    //  GET ALL
    @GetMapping
    public ResponseEntity<List<Ticket>> getAll() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    //  GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    //  UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> update(@PathVariable String id, @Valid @RequestBody Ticket ticket) {
        return ResponseEntity.ok(ticketService.updateTicket(id, ticket));
    }

    //  ADD COMMENT
    @PostMapping("/{id}/comments")
    public ResponseEntity<Ticket> addComment(
            @PathVariable String id,
            @RequestBody CommentRequest request) {

        return ResponseEntity.ok(
                ticketService.addComment(id, request.getText())
        );
    }

    //  IMAGE UPLOAD (NEW)
    @PostMapping("/{id}/upload")
    public ResponseEntity<Ticket> uploadImages(
            @PathVariable String id,
            @RequestParam("files") MultipartFile[] files) throws Exception {

        return ResponseEntity.ok(ticketService.uploadImages(id, files));
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<Ticket> deleteImage(
            @PathVariable String id,
            @RequestParam("url") String url) {

        return ResponseEntity.ok(ticketService.deleteImage(id, url));
    }

    //  DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}