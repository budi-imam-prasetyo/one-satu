package kelompok_satu.backend.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import kelompok_satu.backend.infrastructure.security.JwtService;
import kelompok_satu.backend.user.User;
import kelompok_satu.backend.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
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

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest body) {
        try {
            User user = userService.registerLocalUser(
                    body.name(),
                    body.username(),
                    body.email(),
                    body.password()
            );
            String accessToken = jwtService.generateAccessToken(user);
            return new AuthResponse(accessToken, null, user);
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest body) {
        try {
            User user = userService.authenticateLocalUser(
                    body.email(),
                    body.password()
            );
            String accessToken = jwtService.generateAccessToken(user);
            return new AuthResponse(accessToken, null, user);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }
    }

    public record GoogleLoginRequest(
            String googleId,
            String name,
            String email,
            String picture
    ) {
    }

    public record LoginRequest(
            String email,
            String password
    ) {
    }

    public record RegisterRequest(
            String name,
            String username,
            String email,
            String password
    ) {
    }

    public record AuthResponse(
            @JsonProperty("access_token") String accessToken,
            @JsonProperty("refresh_token") String refreshToken,
            User user
    ) {
    }
}