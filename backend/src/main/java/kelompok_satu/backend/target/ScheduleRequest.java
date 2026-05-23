package kelompok_satu.backend.target;

import kelompok_satu.backend.schedule.ScheduleFrequency;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ScheduleRequest(
        ScheduleFrequency frequency,
        BigDecimal amount,
        LocalDate nextRun,
        Boolean isActive
) {
}
