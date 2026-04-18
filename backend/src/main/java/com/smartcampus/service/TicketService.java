package com.smartcampus.service;

import java.util.List;
import java.util.ArrayList;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.smartcampus.exception.TicketNotFoundException;
import com.smartcampus.model.Comment;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.TicketStatus;
import com.smartcampus.repository.TicketRepository;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

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
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    //  UPDATE
    public Ticket updateTicket(String id, Ticket updated) {
        Ticket ticket = getTicketById(id);

        if (updated.getTitle() != null) {
            ticket.setTitle(updated.getTitle());
        }

        if (updated.getLocation() != null) {
            ticket.setLocation(updated.getLocation());
        }

        if (updated.getCategory() != null) {
            ticket.setCategory(updated.getCategory());
        }

        if (updated.getDescription() != null) {
            ticket.setDescription(updated.getDescription());
        }

        if (updated.getStatus() != null) {
            ticket.setStatus(updated.getStatus());
        }

        if (updated.getPriority() != null) {
            ticket.setPriority(updated.getPriority());
        }

        if (updated.getAssignedTo() != null) {
            ticket.setAssignedTo(updated.getAssignedTo());
        }

        if (updated.getResolutionNotes() != null) {
            ticket.setResolutionNotes(updated.getResolutionNotes());
        }

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
    public String uploadImage(String id, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));

        if (ticket.getImages() == null) {
            ticket.setImages(new ArrayList<>());
        }

        if (ticket.getImages().size() >= 3) {
            throw new IllegalArgumentException("Maximum of 3 images allowed");
        }

        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "" : file.getOriginalFilename()
        );
        String extension = "";
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < originalName.length() - 1) {
            extension = originalName.substring(dotIndex);
        }

        String fileName = UUID.randomUUID() + extension;
        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists() && !uploadFolder.mkdirs()) {
            logger.error("Failed to create upload directory: {}", uploadFolder.getAbsolutePath());
            throw new IOException("Could not create upload directory");
        }

        logger.info("Upload directory: {}", uploadFolder.getAbsolutePath());

        File dest = new File(uploadDir, fileName);
        file.transferTo(dest);

        logger.info("Saved file path: {}", dest.getAbsolutePath());

        String storedPath = "/uploads/" + fileName;
        ticket.getImages().add(storedPath);
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);
        return storedPath;
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