package com.smartcampus.config;

import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfiguration {

    @Bean
    public MongoClient mongoClient(@Value("${spring.data.mongodb.uri}") String mongoUri) {
        String resolvedUri = requireMongoUri(mongoUri);
        return MongoClients.create(resolvedUri);
    }

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory(
            MongoClient mongoClient,
            @Value("${spring.data.mongodb.uri}") String mongoUri) {
        String resolvedUri = requireMongoUri(mongoUri);
        ConnectionString connectionString = new ConnectionString(resolvedUri);
        String databaseName = connectionString.getDatabase();

        if (databaseName == null || databaseName.isBlank()) {
            throw new IllegalStateException(
                    "spring.data.mongodb.uri must include a database name in the connection string.");
        }

        return new SimpleMongoClientDatabaseFactory(mongoClient, databaseName);
    }

    private String requireMongoUri(String mongoUri) {
        if (mongoUri == null || mongoUri.isBlank()) {
            throw new IllegalStateException(
                    "Missing required MongoDB configuration. Set spring.data.mongodb.uri via the MONGODB_URI environment variable.");
        }
        return mongoUri;
    }
}
