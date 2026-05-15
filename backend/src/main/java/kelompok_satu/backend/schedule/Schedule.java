package kelompok_satu.backend.schedule;

import jakarta.persistence.*;
import kelompok_satu.backend.target.Target;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_id", nullable = false, unique = true)
    private Target target;

    @Enumerated(EnumType.STRING)
    @Column(name = "frequency", nullable = false)
    private ScheduleFrequency frequency;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "next_run", nullable = false)
    private LocalDate nextRun;

    @Column(name = "last_run")
    private LocalDateTime lastRun;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
