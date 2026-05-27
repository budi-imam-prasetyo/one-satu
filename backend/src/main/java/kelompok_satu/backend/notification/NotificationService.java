package kelompok_satu.backend.notification;

import kelompok_satu.backend.target.Target;
import kelompok_satu.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final FcmService fcmService;
    private final NotificationSseService notificationSseService;

    @Transactional
    public void createReminder(Target target) {
        String message = String.format(
                "Jangan lupa setor tabungan '%s' sebesar Rp%s!",
                target.getTitle(),
                target.getFrequencyAmount().toPlainString()
        );

        // Simpan in-app
        Notification notification = Notification.builder()
                .user(target.getUser())
                .target(target)
                .title("Pengingat Tabungan")
                .body(message)
                .isRead(false)
                .sentAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);

        notificationSseService.pushToUser(
                target.getUser().getId(),
                toResponse(notification)
        );

        // Kirim push jika ada FCM token
        String fcmToken = target.getUser().getFcmToken();
        if (fcmToken != null && !fcmToken.isBlank()) {
            fcmService.send(fcmToken, "Pengingat Tabungan", message);
        }
    }

    public List<NotificationResponse> getByUser(User principal) {
        return notificationRepository
                .findByUserIdOrderBySentAtDesc(principal.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void markAsRead(User principal, UUID notificationId) {
        Notification notification = notificationRepository
                .findByIdAndUserId(notificationId, principal.getId())
                .orElseThrow(() -> new RuntimeException("Notifikasi tidak ditemukan"));
        notification.setRead(true);
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getBody(),
                n.isRead(),
                n.getSentAt()
        );
    }
}