package backend;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import backend.entity.Resource;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByType(String type);

    List<Resource> findByLocation(String location);

    List<Resource> findByStatus(String status);

    List<Resource> findByCapacityGreaterThanEqual(int capacity);
}
