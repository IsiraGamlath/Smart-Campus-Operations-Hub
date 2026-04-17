package backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import backend.model.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {
}
