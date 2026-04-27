package com.smartcampus.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smartcampus.model.Notification;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.NotificationRepository;
import com.smartcampus.repository.UserRepository;

@Service
public class NotificationsService {

	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;

	public NotificationsService(NotificationRepository notificationRepository, UserRepository userRepository) {
		this.notificationRepository = notificationRepository;
		this.userRepository = userRepository;
	}

	public Notification createNotification(String userId, String message) {
		Notification notification = new Notification(userId, message);
		return notificationRepository.save(notification);
	}

	public List<Notification> getNotificationsByUser(String userId) {
		return notificationRepository.findByUserId(userId);
	}

	public Optional<Notification> markAsRead(String notificationId) {
		return notificationRepository.findById(notificationId)
				.map(notification -> {
					notification.setRead(true);
					return notificationRepository.save(notification);
				});
	}

	public List<Notification> createNotificationsForRole(Role role, String message) {
		if (role == null || message == null || message.isBlank()) {
			return List.of();
		}

		List<User> users = userRepository.findByRole(role);
		if (users.isEmpty()) {
			return List.of();
		}

		List<Notification> notifications = new ArrayList<>();
		for (User user : users) {
			if (user.getId() == null || user.getId().isBlank()) {
				continue;
			}
			notifications.add(new Notification(user.getId(), message));
		}

		if (notifications.isEmpty()) {
			return List.of();
		}

		return notificationRepository.saveAll(notifications);
	}

	public List<Notification> createNotificationForAdmins(String message) {
		return createNotificationsForRole(Role.ADMIN, message);
	}

	public void deleteNotification(String id) {
		notificationRepository.deleteById(id);
	}
}
