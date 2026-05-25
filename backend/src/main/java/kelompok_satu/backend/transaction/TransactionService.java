package kelompok_satu.backend.transaction;

import kelompok_satu.backend.target.TargetStatus;

import kelompok_satu.backend.target.Target;
import kelompok_satu.backend.target.TargetRepository;
import kelompok_satu.backend.user.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TargetRepository targetRepository;

    // get history transaksi berdasarkan target
    public Page<TransactionResponse> getByTarget(
        User principal,
        UUID targetId,
        int page,
        int size
    ){
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

    // create transaksi baru
    @Transactional
    public TransactionResponse createTransaction(
        User principal,
        TransactionRequest request
    ){
        if (principal == null || principal.getId() == null) {
            throw new RuntimeException("Unauthorized");
        }

        Target target = targetRepository
                .findByIdAndUserId(
                    request.getTargetId(),
                    principal.getId()
                )
                .orElseThrow(() ->
                    new RuntimeException("Target tidak ditemukan"));

        BigDecimal currentAmount = target.getCurrentAmount();

        // deposit
        if (request.getType() == TransactionType.DEPOSIT) {

            target.setCurrentAmount(
                currentAmount.add(request.getAmount())
            );
    }

    // withdraw
    else if (request.getType() == TransactionType.WITHDRAW) {
        
        if (currentAmount.compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Saldo tidak cukup");
        }

        target.setCurrentAmount(
            currentAmount.subtract(request.getAmount())
        );
    }

    // validasi target complete
    if (target.getCurrentAmount()
        .compareTo(target.getTargetAmount()) >= 0) {

        target.setStatus(TargetStatus.COMPLETED);

    } else {

    target.setStatus(TargetStatus.ACTIVE);
    }

    //save target
    targetRepository.save(target);

    // create transaksi
    Transaction transaction = Transaction.builder()
            .target(target)
            .type(request.getType())
            .amount(request.getAmount())
            .note(request.getNote())
            .createdAt(LocalDateTime.now())
            .build();
    
    // save transaksi
    Transaction savedTransaction = transactionRepository.save(transaction);
    return toResponse(savedTransaction);
    }

    // Entity -> Response
    private TransactionResponse toResponse(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getTarget().getId(),
                t.getType(),
                t.getAmount(),
                t.getNote(),
                t.getCreatedAt()
        );
    }

}