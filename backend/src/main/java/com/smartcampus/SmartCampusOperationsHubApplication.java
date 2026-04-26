package com.smartcampus;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartCampusOperationsHubApplication {

    public static void main(String[] args) {

        // Load .env file
        Dotenv dotenv = Dotenv.load();

        // Set values to Spring environment
        System.setProperty("MONGO_URI", dotenv.get("MONGO_URI"));
        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
        System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));

        SpringApplication.run(SmartCampusOperationsHubApplication.class, args);
    }
}