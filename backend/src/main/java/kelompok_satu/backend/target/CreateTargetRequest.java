package kelompok_satu.backend.target;

import jakarta.persistence.EnumeratedValue;
import jakarta.validation.constraints.*;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;


//@Builder
public record CreateTargetRequest(

        @NotBlank
        String title,

        @NotNull
        @Min(0)
        BigDecimal targetAmount,

        @NotNull
        @FutureOrPresent
        LocalDate deadline,

        @NotNull
        TargetFrequency frequency,

        @NotNull
        @Min(0)
        BigDecimal frequencyAmount
) {
}
