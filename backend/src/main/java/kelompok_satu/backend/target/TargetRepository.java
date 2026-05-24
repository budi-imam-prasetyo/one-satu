package kelompok_satu.backend.target;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface TargetRepository extends JpaRepository<Target, UUID> {

     List<Target> findByUserId(UUID id);

    List<Target> findByUserIdAndStatus(UUID id, TargetStatus status);

    int countByUserId(UUID id);
    int countByUserIdAndStatus(UUID id, TargetStatus status);

    @Query("SELECT COALESCE(SUM(t.currentAmount), 0) FROM Target t WHERE t.user.id = :userId")
    BigDecimal sumCurrentAmountByUserId(@Param("userId") UUID userId);
}
