package backend.service;

import java.util.List;
import java.util.ArrayList;
import java.io.File;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import backend.exception.TicketNotFoundException;
import backend.model.Comment;
import backend.model.Ticket;
import backend.model.TicketStatus;
import backend.repository.TicketRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    //  CREATE
    public Ticket createTicketWithImage(Ticket ticket, MultipartFile imageFile) throws java.io.IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            byte[] bytes = imageFile.getBytes();
            String base64Image = java.util.Base64.getEncoder().encodeToString(bytes);
            ticket.setImage(base64Image);
        }
        return createTicket(ticket);
    }

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    //  GET ALL
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    //  GET BY ID
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    //  UPDATE
    public Ticket updateTicket(String id, Ticket updated) {
        Ticket ticket = getTicketById(id);

        if (updated.getTitle() != null) ticket.setTitle(updated.getTitle());
        if (updated.getLocation() != null) ticket.setLocation(updated.getLocation());
        if (updated.getCategory() != null) ticket.setCategory(updated.getCategory());
        if (updated.getDescription() != null) ticket.setDescription(updated.getDescription());
        if (updated.getStatus() != null) ticket.setStatus(updated.getStatus());
        if (updated.getPriority() != null) ticket.setPriority(updated.getPriority());
        if (updated.getAssignedTo() != null) ticket.setAssignedTo(updated.getAssignedTo());
        if (updated.getContact() != null) ticket.setContact(updated.getContact());

        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // ADD COMMENT
    public Ticket addComment(String id, String text) {
        Ticket ticket = getTicketById(id);

        if (ticket.getComments() == null) {
            ticket.setComments(new ArrayList<>());
        }

        Comment comment = new Comment(
                java.util.UUID.randomUUID().toString(),
                "Admin",
                text,
                LocalDateTime.now()
        );

        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    //  DELETE COMMENT
    public Ticket deleteComment(String id, String commentId) {
        Ticket ticket = getTicketById(id);

        if (ticket.getComments() != null) {
            ticket.getComments().removeIf(c -> c.getId().equals(commentId));
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    //  IMAGE UPLOAD
    public Ticket uploadImages(String id, MultipartFile[] files) throws Exception {
        Ticket ticket = getTicketById(id);

        if (ticket.getImages() == null) {
            ticket.setImages(new ArrayList<>());
        }

        for (MultipartFile file : files) {

            if (ticket.getImages().size() >= 3) break;

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = "uploads/";

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            file.transferTo(new File(uploadDir + fileName));

            ticket.getImages().add("http://localhost:8091/uploads/" + fileName);
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    //  DELETE IMAGE
    public Ticket deleteImage(String id, String url) {
        Ticket ticket = getTicketById(id);

        if (ticket.getImages() != null) {
            ticket.getImages().removeIf(img -> img.equals(url));
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    //  DELETE
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}