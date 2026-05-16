package kelompok_satu.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/google")
    public Map<String, Object> googleLogin(
            @RequestBody Map<String, Object> body
    ) {

        String googleId = (String) body.get("googleId");
        String name = (String) body.get("name");
        String email = (String) body.get("email");
        String picture = (String) body.get("picture");

        // TODO:
        // nanti:
        // - verify token google
        // - cari user di database
        // - create user jika belum ada
        // - generate JWT asli

        Map<String, Object> user = new HashMap<>();

        user.put("id", UUID.randomUUID());
        user.put("name", name);
        user.put("email", email);
        user.put("username", email.split("@")[0]);
        user.put("picture", picture);
        user.put("googleId", googleId);

        Map<String, Object> response = new HashMap<>();

        response.put(
                "token",
                "dummy-jwt-token"
        );

        response.put(
                "user",
                user
        );

        return response;
    }
}