package kelompok_satu.backend.target;

import java.math.BigDecimal;

public record DashboardStats(
        BigDecimal totalSavings,
        int totalTargets,
        int totalCompleted
) {
}
