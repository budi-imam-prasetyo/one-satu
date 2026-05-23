package kelompok_satu.backend.target;

import jakarta.persistence.*;
import kelompok_satu.backend.notification.Notification;
import kelompok_satu.backend.schedule.Schedule;
import kelompok_satu.backend.transaction.Transaction;
import kelompok_satu.backend.user.User;
import kelompok_satu.backend.infrastructure.persistence.AuditableEntity;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "targets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Target extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false)
    private String title;

//    @Column(name = "description", columnDefinition = "TEXT")
//    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TargetStatus status = TargetStatus.ACTIVE;

    @Column(name = "target_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(name = "current_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentAmount = BigDecimal.ZERO;

    @Column(name = "deadline", nullable = true)
    private LocalDate deadline;

    @OneToOne(mappedBy = "target", cascade = CascadeType.ALL, orphanRemoval = true)
    private Schedule schedule;

    @OneToMany(mappedBy = "target", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "target")
    private List<Notification> notifications;
}