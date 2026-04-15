package backend;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.entity.Resource;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }

    public List<Resource> getResourcesByLocation(String location) {
        return resourceRepository.findByLocation(location);
    }

    public List<Resource> getResourcesByStatus(String status) {
        return resourceRepository.findByStatus(status);
    }

    public List<Resource> getResourcesByMinimumCapacity(int capacity) {
        return resourceRepository.findByCapacityGreaterThanEqual(capacity);
    }

    public List<Resource> searchResourcesByName(String name) {
        return resourceRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Resource> searchResourcesByTypeIgnoreCase(String type) {
        return resourceRepository.findByTypeIgnoreCase(type);
    }

    public List<Resource> searchResourcesByLocationIgnoreCase(String location) {
        return resourceRepository.findByLocationIgnoreCase(location);
    }

    public Resource getResourceById(String id) {
        Optional<Resource> resource = resourceRepository.findById(id);
        return resource.orElse(null);
    }

    public Resource addResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, Resource resource) {
        Optional<Resource> existing = resourceRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }

        Resource updated = existing.get();
        updated.setName(resource.getName());
        updated.setType(resource.getType());
        updated.setCapacity(resource.getCapacity());
        updated.setLocation(resource.getLocation());
        updated.setAvailabilityStart(resource.getAvailabilityStart());
        updated.setAvailabilityEnd(resource.getAvailabilityEnd());
        updated.setStatus(resource.getStatus());
        updated.setDescription(resource.getDescription());

        return resourceRepository.save(updated);
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}
