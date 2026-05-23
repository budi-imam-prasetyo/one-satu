package kelompok_satu.backend.target;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TargetResponse(
        UUID id,
        UUID userId,
        String name,
//        String description,
        String imageUrl,
        TargetStatus status,
        BigDecimal targetAmount,
        BigDecimal currentAmount,
        TargetFrequency frequency,
        BigDecimal frequencyAmount,
        LocalDate deadline
) {
}
