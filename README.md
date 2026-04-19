# Smart Campus Operations Hub

The Smart Campus Operations Hub is a full-stack web application designed to manage campus resources, bookings, maintenance, notifications, and user access in a centralized system. The platform integrates multiple modules to streamline campus operations while ensuring security, scalability, and usability.

### Overview

This system allows users to browse and book campus resources, report incidents, and receive updates, while administrators manage approvals, resources, and system operations. The application is built with a Spring Boot backend and a React frontend, with MongoDB used for data storage.

### Features
#### Module A – Facilities & Assets Catalogue

Manage campus resources such as rooms, labs, and equipment
Add, update, and delete resources
Includes metadata: type, capacity, location, availability, and status
Search and filtering functionality for easy resource discovery

#### Module B – Booking Management

Users can create bookings with date, time, purpose, and attendees
Booking workflow implemented: PENDING → APPROVED / REJECTED → CANCELLED
Conflict detection prevents overlapping bookings for the same resource
Admin approval and rejection system included
Improved handling for booking conflicts and validation

#### Module C – Maintenance & Incident Ticketing

Users can create incident tickets for specific resources or locations with category, description, priority, and preferred contact details
Supports up to 3 image attachments for reporting issues such as damaged equipment or system errors
Ticket workflow implemented: OPEN → IN_PROGRESS → RESOLVED → CLOSED, with REJECTED state including a reason
Technicians or staff members can be assigned to tickets
Assigned personnel can update ticket status and add resolution notes
Users and staff can add comments to tickets
Comment ownership rules are enforced, allowing proper edit and delete permissions

#### Module D – Notifications

Notification system implemented with user-based targeting
Supports system-generated notifications for key actions such as booking updates and ticket changes
Backend structure prepared for future real-time notification enhancements

#### Module E – Authentication & Security

Google OAuth2 login integration
Role-based access control (Admin and User roles)
Spring Security used to secure all endpoints
User-specific data access enforced (users can only access their own data)
Protected routes implemented in the frontend

### Additional Improvements

Resolved merge conflicts across all modules
Standardized backend architecture using controller, service, and repository layers
Improved API validation and error handling
Fixed file handling and upload system
Cleaned and organized project structure for maintainability

### Testing

Backend build and application startup verified successfully

### Core features tested include:

Resource management
Booking workflow and conflict detection
Google OAuth2 authentication
Role-based access control
Incident ticket creation and workflow
Integration across all modules

### Tech Stack

Frontend: React
Backend: Spring Boot
Database: MongoDB
Authentication: Google OAuth2
Security: Spring Security

### Summary

The Smart Campus Operations Hub delivers a fully integrated and stable system for managing campus operations. It combines resource management, booking workflows, maintenance tracking, notifications, and secure authentication into a single platform, meeting the core requirements of a modern campus management solution.
