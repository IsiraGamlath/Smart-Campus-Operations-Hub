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
        return ticketRepository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));
    }

    //  UPDATE
    public Ticket updateTicket(String id, Ticket updatedTicket) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));

        ticket.setLocation(updatedTicket.getLocation());
        ticket.setCategory(updatedTicket.getCategory());
        ticket.setDescription(updatedTicket.getDescription());

        if (updatedTicket.getStatus() != null) {
            ticket.setStatus(updatedTicket.getStatus());
        }
        if (updatedTicket.getPriority() != null) {
            ticket.setPriority(updatedTicket.getPriority());
        }
        if (updatedTicket.getAssignedTo() != null) {
            ticket.setAssignedTo(updatedTicket.getAssignedTo());
        }
        if (updatedTicket.getResolutionNotes() != null) {
            ticket.setResolutionNotes(updatedTicket.getResolutionNotes());
        }

        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    //  ADD COMMENT
    public Ticket addComment(String id, String commentText) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));

        if (ticket.getComments() == null) {
            ticket.setComments(new ArrayList<>());
        }

        Comment comment = new Comment(id, "Admin", commentText, LocalDateTime.now());
        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    //  IMAGE UPLOAD (NEW)
    public Ticket uploadImages(String id, MultipartFile[] files) throws Exception {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));

        if (ticket.getImages() == null) {
            ticket.setImages(new ArrayList<>());
        }

        for (MultipartFile file : files) {

            //  limit to 3 images
            if (ticket.getImages().size() >= 3) break;

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            String uploadDir = "uploads/";
            File uploadPath = new File(uploadDir);

            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            file.transferTo(new File(uploadDir + fileName));

            // save URL
            ticket.getImages().add("http://localhost:8081/uploads/" + fileName);
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket deleteImage(String id, String imageUrl) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));

        if (ticket.getImages() != null) {
            ticket.getImages().removeIf(url -> url.equals(imageUrl));
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    //  DELETE
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}