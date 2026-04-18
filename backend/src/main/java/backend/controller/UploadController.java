package backend.controller;

import backend.model.Ticket;
import backend.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class UploadController {

    private final TicketService ticketService;

    public UploadController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ticketId") String ticketId) throws Exception {
        
        System.out.println("DEBUG [UPLOAD]: Received file for ticket " + ticketId);
        
        // Use existing service logic to save file and update ticket
        MultipartFile[] files = new MultipartFile[]{file};
        Ticket updated = ticketService.uploadImages(ticketId, files);
        
        return ResponseEntity.ok(updated);
    }
}
