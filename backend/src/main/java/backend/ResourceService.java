package backend;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Resource getResourceById(Long id) {
        Optional<Resource> resource = resourceRepository.findById(id);
        return resource.orElse(null);
    }

    public Resource addResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource resource) {
        Optional<Resource> existing = resourceRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }

        Resource updated = existing.get();
        updated.setName(resource.getName());
        updated.setType(resource.getType());
        updated.setCapacity(resource.getCapacity());
        updated.setLocation(resource.getLocation());
        updated.setAvailabilityWindow(resource.getAvailabilityWindow());
        updated.setStatus(resource.getStatus());
        updated.setDescription(resource.getDescription());

        return resourceRepository.save(updated);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
