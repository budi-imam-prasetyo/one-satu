package kelompok_satu.backend.notification;

import kelompok_satu.backend.infrastructure.response.WebResponse;
import kelompok_satu.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationSseService notificationSseService;

    @GetMapping
    public WebResponse<List<NotificationResponse>> getAll(
            @AuthenticationPrincipal User user) {
        return WebResponse.<List<NotificationResponse>>builder()
                .data(notificationService.getByUser(user))
                .build();
    }

    @PatchMapping("/{id}/read")
    public WebResponse<String> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        notificationService.markAsRead(user, id);
        return WebResponse.<String>builder()
                .data("Notifikasi ditandai sudah dibaca")
                .build();
    }

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal User user) {
        return notificationSseService.subscribe(user.getId());
    }
}
