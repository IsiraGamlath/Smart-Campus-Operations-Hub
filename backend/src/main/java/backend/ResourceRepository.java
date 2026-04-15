package backend;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByType(String type);

    List<Resource> findByLocation(String location);

    List<Resource> findByStatus(String status);
}

