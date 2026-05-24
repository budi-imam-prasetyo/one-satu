package kelompok_satu.backend.target;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateTargetRequest(
        @NotBlank
        String title,

        @NotNull
        @DecimalMin("0")
        BigDecimal targetAmount,

        @NotNull
        @FutureOrPresent
        LocalDate deadline,

        @NotNull
        TargetFrequency frequency,

        @NotNull
        @DecimalMin("0")
        BigDecimal frequencyAmount,

        String imageUrl
) {}