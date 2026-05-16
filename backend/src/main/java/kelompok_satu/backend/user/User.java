package kelompok_satu.backend.user;

import jakarta.persistence.*;
import kelompok_satu.backend.notification.Notification;
import kelompok_satu.backend.infrastructure.persistence.AuditableEntity;
import kelompok_satu.backend.target.Target;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "google_id", unique = true)
    private String googleId;

    @Column(name = "temp_id", unique = true)
    private String tempId;

    @Column(name = "is_guest", nullable = false)
    private boolean isGuest = true;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "name")
    private String name;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "fcm_token")
    private String fcmToken;

    @Column(name = "last_active")
    private LocalDateTime lastActive;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Target> targets;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications;
}
