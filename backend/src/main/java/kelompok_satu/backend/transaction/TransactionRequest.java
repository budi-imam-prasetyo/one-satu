package kelompok_satu.backend.transaction;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class TransactionRequest {

    private UUID targetId;
    private TransactionType type;
    private BigDecimal amount;
    private String note;
    
}
