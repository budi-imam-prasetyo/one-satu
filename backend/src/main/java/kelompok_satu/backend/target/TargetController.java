package kelompok_satu.backend.target;

import kelompok_satu.backend.infrastructure.response.WebResponse;
import kelompok_satu.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/targets")
public class TargetController {

    @Autowired
    private TargetService targetService;

    @GetMapping
    public WebResponse <List<TargetResponse>> getTargets(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) TargetStatus status
    ){
        List<TargetResponse> response = targetService.findByUserId(user, status);
        return WebResponse.<List<TargetResponse>>builder().data(response).build();
    }

    @GetMapping("/stats")
    public WebResponse<DashboardStats> getDashboardStats(
            @AuthenticationPrincipal User user
    ) {
        DashboardStats stats = targetService.getDashboardStats(user);
        return WebResponse.<DashboardStats>builder().data(stats).build();
    }

    @GetMapping("/{id}")
    public WebResponse<TargetDetailResponse> getDetail(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        TargetDetailResponse response = targetService.getDetail(user, id);
        return WebResponse.<TargetDetailResponse>builder().data(response).build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public WebResponse<TargetResponse> createTarget(
            @AuthenticationPrincipal User user,
            @ModelAttribute CreateTargetRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        TargetResponse response = targetService.create(user, request, image);
        return WebResponse.<TargetResponse>builder().data(response).build();
    }
}
