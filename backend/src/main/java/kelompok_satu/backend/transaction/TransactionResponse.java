package kelompok_satu.backend.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        TransactionType type,
        BigDecimal amount,
        String note,
        LocalDateTime createdAt
) {
}
