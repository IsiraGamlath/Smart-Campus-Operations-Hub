package backend;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public List<backend.entity.Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    @GetMapping("/{id}")
    public backend.entity.Resource getResourceById(@PathVariable String id) {
        return resourceService.getResourceById(id);
    }

    @PostMapping
    public backend.entity.Resource addResource(@RequestBody backend.entity.Resource resource) {
        return resourceService.addResource(resource);
    }

    @PutMapping("/{id}")
    public backend.entity.Resource updateResource(@PathVariable String id, @RequestBody backend.entity.Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
    }

    @GetMapping("/type/{type}")
    public List<backend.entity.Resource> getResourcesByType(@PathVariable String type) {
        return resourceService.getResourcesByType(type);
    }

    @GetMapping("/location/{location}")
    public List<backend.entity.Resource> getResourcesByLocation(@PathVariable String location) {
        return resourceService.getResourcesByLocation(location);
    }
}
