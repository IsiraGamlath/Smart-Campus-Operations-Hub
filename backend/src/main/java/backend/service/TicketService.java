package backend.service;

import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return ticketRepository.save(ticket);
    }

    //  GET ALL
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    //  GET BY ID
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id).orElseThrow();
    }

    //  UPDATE
    public Ticket updateTicket(String id, Ticket updatedTicket) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();

        ticket.setTitle(updatedTicket.getTitle());
        ticket.setDescription(updatedTicket.getDescription());
        ticket.setStatus(updatedTicket.getStatus());
        ticket.setPriority(updatedTicket.getPriority());

        //  DO NOT overwrite comments/images
        return ticketRepository.save(ticket);
    }

    //  ADD COMMENT (NEW)
    public Ticket addComment(String id, String comment) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();

        if (ticket.getComments() == null) {
            ticket.setComments(new ArrayList<>());
        }

        ticket.getComments().add(comment);

        return ticketRepository.save(ticket);
    }

    //  DELETE
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}