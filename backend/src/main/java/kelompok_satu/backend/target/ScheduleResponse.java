package kelompok_satu.backend.target;

import kelompok_satu.backend.schedule.ScheduleFrequency;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ScheduleResponse(
        ScheduleFrequency frequency,
        BigDecimal amount,
        LocalDate nextRun,
        boolean isActive
) {
}
