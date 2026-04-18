package com.smartcampus.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smartcampus.model.Notification;
import com.smartcampus.repository.NotificationRepository;

@Service
public class NotificationsService {

	private final NotificationRepository notificationRepository;

	public NotificationsService(NotificationRepository notificationRepository) {
		this.notificationRepository = notificationRepository;
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

	public void deleteNotification(String id) {
		notificationRepository.deleteById(id);
	}
}
