package com.smartcampus.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartcampus.model.Resource;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByType(String type);

    List<Resource> findByTypeIgnoreCase(String type);

    List<Resource> findByNameContainingIgnoreCase(String name);

    List<Resource> findByLocation(String location);

    List<Resource> findByLocationIgnoreCase(String location);

    List<Resource> findByStatus(String status);

    List<Resource> findByTypeIgnoreCaseAndLocationIgnoreCase(String type, String location);

    List<Resource> findByStatusIgnoreCaseAndCapacityGreaterThanEqual(String status, int capacity);

    List<Resource> findByCapacityGreaterThanEqual(int capacity);

    List<Resource> findByBookingDate(String bookingDate);
}
