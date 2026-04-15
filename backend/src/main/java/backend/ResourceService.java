package backend;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<backend.entity.Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<backend.entity.Resource> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }

    public List<backend.entity.Resource> getResourcesByLocation(String location) {
        return resourceRepository.findByLocation(location);
    }

    public backend.entity.Resource getResourceById(String id) {
        Optional<backend.entity.Resource> resource = resourceRepository.findById(id);
        return resource.orElse(null);
    }

    public backend.entity.Resource addResource(backend.entity.Resource resource) {
        return resourceRepository.save(resource);
    }

    public backend.entity.Resource updateResource(String id, backend.entity.Resource resource) {
        Optional<backend.entity.Resource> existing = resourceRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }

        backend.entity.Resource updated = existing.get();
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
