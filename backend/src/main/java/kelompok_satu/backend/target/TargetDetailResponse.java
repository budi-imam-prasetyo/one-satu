package kelompok_satu.backend.target;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TargetDetailResponse(
        UUID id,
        UUID userId,
        String title,
        String imageUrl,
        TargetStatus status,
        BigDecimal targetAmount,
        BigDecimal currentAmount,
        BigDecimal remainingAmount,
        int progressPercent,
        TargetFrequency frequency,
        BigDecimal frequencyAmount,
        LocalDate deadline
) {
}
