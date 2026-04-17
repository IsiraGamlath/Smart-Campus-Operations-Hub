package backend;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.Resource;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable String id) {
        return resourceService.getResourceById(id);
    }

    @PostMapping
    public Resource addResource(@Valid @RequestBody Resource resource) {
        return resourceService.addResource(resource);
    }

    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable String id, @Valid @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
    }

    @GetMapping("/type/{type}")
    public List<Resource> getResourcesByType(@PathVariable String type) {
        return resourceService.getResourcesByType(type);
    }

    @GetMapping("/location/{location}")
    public List<Resource> getResourcesByLocation(@PathVariable String location) {
        return resourceService.getResourcesByLocation(location);
    }

    @GetMapping("/status/{status}")
    public List<Resource> getResourcesByStatus(@PathVariable String status) {
        return resourceService.getResourcesByStatus(status);
    }

    @GetMapping("/capacity/{capacity}")
    public List<Resource> getResourcesByMinimumCapacity(@PathVariable int capacity) {
        return resourceService.getResourcesByMinimumCapacity(capacity);
    }

    @GetMapping("/search/name/{name}")
    public List<Resource> searchResourcesByName(@PathVariable String name) {
        return resourceService.searchResourcesByName(name);
    }

    @GetMapping("/search/type/{type}")
    public List<Resource> searchResourcesByTypeIgnoreCase(@PathVariable String type) {
        return resourceService.searchResourcesByTypeIgnoreCase(type);
    }

    @GetMapping("/search/location/{location}")
    public List<Resource> searchResourcesByLocationIgnoreCase(@PathVariable String location) {
        return resourceService.searchResourcesByLocationIgnoreCase(location);
    }
}
