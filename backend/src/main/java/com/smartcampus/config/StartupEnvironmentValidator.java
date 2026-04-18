package com.smartcampus.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class StartupEnvironmentValidator implements ApplicationRunner {

    private final Environment environment;

    public StartupEnvironmentValidator(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<String> missingProperties = new ArrayList<>();

        validateRequiredProperty("spring.security.oauth2.client.registration.google.client-id", missingProperties);
        validateRequiredProperty("spring.security.oauth2.client.registration.google.client-secret", missingProperties);

        if (!missingProperties.isEmpty()) {
            throw new IllegalStateException(
                    "Missing required OAuth2 configuration value(s): " + String.join(", ", missingProperties)
                            + ". Set them in application.properties or as environment variables.");
        }
    }

    private void validateRequiredProperty(String key, List<String> missingProperties) {
        String value = environment.getProperty(key);
        if (value == null || value.isBlank()) {
            missingProperties.add(key);
        }
    }
}
