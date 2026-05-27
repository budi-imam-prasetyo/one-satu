package kelompok_satu.backend.transaction;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record TransactionResponse(
        UUID id,
        UUID targetId,
        TransactionType type,
        BigDecimal amount,
        String note,
        LocalDateTime createdAt
) {
}