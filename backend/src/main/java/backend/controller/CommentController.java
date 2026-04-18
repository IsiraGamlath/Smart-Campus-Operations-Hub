package backend.controller;

import backend.model.Comment;
import backend.model.Ticket;
import backend.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final TicketService ticketService;

    public CommentController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // POST /api/comments - Create a new comment
    @PostMapping
    public ResponseEntity<Ticket> addComment(@RequestBody Map<String, String> payload) {
        String ticketId = payload.get("ticketId");
        String text = payload.get("text");
        System.out.println("DEBUG [POST /api/comments]: Adding comment to ticket " + ticketId);
        return ResponseEntity.ok(ticketService.addComment(ticketId, text));
    }

    // GET /api/comments/{ticketId} - Fetch comments for a ticket
    @GetMapping("/{ticketId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String ticketId) {
        System.out.println("DEBUG [GET /api/comments]: Fetching comments for ticket " + ticketId);
        Ticket ticket = ticketService.getTicketById(ticketId);
        return ResponseEntity.ok(ticket.getComments());
    }
}
