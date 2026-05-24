package kelompok_satu.backend.transaction;

import kelompok_satu.backend.target.TargetRepository;
import kelompok_satu.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TargetRepository targetRepository;

    public Page<TransactionResponse> getByTarget(User principal, UUID targetId, int page, int size) {
        if (principal == null || principal.getId() == null) {
            throw new RuntimeException("Unauthorized");
        }

        targetRepository.findByIdAndUserId(targetId, principal.getId())
                .orElseThrow(() -> new RuntimeException("Target tidak ditemukan"));

        Pageable pageable = PageRequest.of(page, size);

        return transactionRepository
                .findByTargetIdOrderByCreatedAtDesc(targetId, pageable)
                .map(this::toResponse);
    }

    private TransactionResponse toResponse(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getType(),
                t.getAmount(),
                t.getNote(),
                t.getCreatedAt()
        );
    }
}