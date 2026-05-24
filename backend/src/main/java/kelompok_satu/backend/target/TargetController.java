package kelompok_satu.backend.target;

import kelompok_satu.backend.infrastructure.response.WebResponse;
import kelompok_satu.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/targets")
public class TargetController {

    @Autowired
    private TargetService targetService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public WebResponse<TargetResponse> createTarget(
            @AuthenticationPrincipal User user,
            @ModelAttribute CreateTargetRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image  // ← pisah di sini
    ) throws IOException {
        TargetResponse response = targetService.create(user, request, image);
        return WebResponse.<TargetResponse>builder().data(response).build();
    }
}
