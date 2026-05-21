package kelompok_satu.backend.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import kelompok_satu.backend.infrastructure.security.JwtService;
import kelompok_satu.backend.user.User;
import kelompok_satu.backend.user.UserService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/google")
    public AuthResponse googleLogin(
            @RequestBody GoogleLoginRequest body
    ) {
        User user = userService.upsertGoogleUser(
                body.googleId(),
                body.name(),
                body.email()
        );

        String accessToken = jwtService.generateAccessToken(user);

        return new AuthResponse(accessToken, null, user);
    }

    public record GoogleLoginRequest(
            String googleId,
            String name,
            String email,
            String picture
    ) {
    }

    public record AuthResponse(
            @JsonProperty("access_token") String accessToken,
            @JsonProperty("refresh_token") String refreshToken,
            User user
    ) {
    }
}