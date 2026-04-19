package com.smartcampus.config;

import com.mongodb.client.MongoClient;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseLogger {

    @Autowired
    private MongoClient mongoClient;

    @PostConstruct
    public void logConnection() {
        try {
            mongoClient.listDatabaseNames().first();
            System.out.println("=========================================");
            System.out.println("   MongoDB Connected Successfully!       ");
            System.out.println("   Database: Smart_Campus                ");
            System.out.println("=========================================");
        } catch (Exception e) {
            System.err.println("=========================================");
            System.err.println("   ERROR: MongoDB Connection Failed!     ");
            System.err.println("   Details: " + e.getMessage());
            System.err.println("=========================================");
        }
    }
}
