package kelompok_satu.backend.target;

import kelompok_satu.backend.infrastructure.response.WebResponse;
import kelompok_satu.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/targets")
public class TargetController {

    @Autowired
    private TargetService targetService;

//    public TargetController(TargetService targetService) {
//        this.targetService = targetService;
//    }

    @PostMapping
    public WebResponse<TargetResponse> createTarget(
            @AuthenticationPrincipal User user,
            @RequestBody CreateTargetRequest request
    ) {
        TargetResponse response = targetService.create(user, request);
        return WebResponse.<TargetResponse>builder().data(response).build();
    }




    @GetMapping("/me")
    public String me(@AuthenticationPrincipal User user) {
        return user.getId().toString();
    }
}
