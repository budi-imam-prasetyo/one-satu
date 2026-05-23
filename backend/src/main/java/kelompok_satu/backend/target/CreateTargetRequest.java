package kelompok_satu.backend.target;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDate;


@Builder
public record CreateTargetRequest(

        @NotBlank
        String title,

        String imageUrl,

        @NotNull
        @Min(0)
        BigDecimal targetAmount,

        @NotNull
        @FutureOrPresent
        LocalDate deadline,

        @NotNull
        ScheduleRequest schedule
) {
}
