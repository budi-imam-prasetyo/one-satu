package kelompok_satu.backend.target;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TargetRepository extends JpaRepository<Target, UUID> {

     List<Target> findByUserId(UUID id);

    List<Target> findByUserIdAndStatus(UUID id, TargetStatus status);

    int countByUserId(UUID id);
    int countByUserIdAndStatus(UUID id, TargetStatus status);

    @Query("SELECT COALESCE(SUM(t.currentAmount), 0) FROM Target t WHERE t.user.id = :userId")
    BigDecimal sumCurrentAmountByUserId(@Param("userId") UUID userId);

    Optional<Target> findByIdAndUserId(UUID id, UUID userId);

    @Query("SELECT t FROM Target t WHERE t.status = :status AND t.nextNotifyDate = :date AND t.notifyAt IS NOT NULL")
    List<Target> findActiveTargetsToNotify(
            @Param("status") TargetStatus status,
            @Param("date") LocalDate date
    );
}
