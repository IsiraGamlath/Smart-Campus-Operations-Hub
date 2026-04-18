package com.smartcampus.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.smartcampus.model.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {
}
