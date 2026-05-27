package kelompok_satu.backend.notification;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String title,
        String message,
        boolean isRead,
        LocalDateTime sentAt
) {
}
