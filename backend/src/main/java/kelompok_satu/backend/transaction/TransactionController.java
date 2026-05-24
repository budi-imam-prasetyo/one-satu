package kelompok_satu.backend.transaction;

import kelompok_satu.backend.infrastructure.response.WebResponse;
import kelompok_satu.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/targets/{targetId}/transactions")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public WebResponse<Page<TransactionResponse>> getByTarget(
            @AuthenticationPrincipal User user,
            @PathVariable UUID targetId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<TransactionResponse> responses = transactionService.getByTarget(user, targetId, page, size);
        return WebResponse.<Page<TransactionResponse>>builder().data(responses).build();
    }
}
