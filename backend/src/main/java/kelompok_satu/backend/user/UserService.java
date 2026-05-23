package kelompok_satu.backend.user;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User user) {

        if (user.getEmail() != null &&
                userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (user.getUsername() != null &&
                userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        user.setLastActive(LocalDateTime.now());

        return userRepository.save(user);
    }

    public User updateUser(UUID id, User userDetails) {

        User user = getUserById(id);

        user.setName(userDetails.getName());
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFcmToken(userDetails.getFcmToken());
        user.setLastActive(LocalDateTime.now());

        return userRepository.save(user);
    }

    public User upsertGoogleUser(String googleId, String name, String email) {
        User user = null;

        if (googleId != null && !googleId.isBlank()) {
            user = userRepository.findByGoogleId(googleId).orElse(null);
        }

        if (user == null && email != null && !email.isBlank()) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        if (user == null) {
            String username = generateUniqueUsername(email);
            user = User.builder()
                    .googleId(googleId)
                    .name(name)
                    .email(email)
                    .username(username)
                    .isGuest(false)
                    .lastActive(LocalDateTime.now())
                    .build();
            return userRepository.save(user);
        }

        if (googleId != null && !googleId.isBlank()) {
            user.setGoogleId(googleId);
        }
        if (name != null && !name.isBlank()) {
            user.setName(name);
        }
        if (email != null && !email.isBlank()) {
            user.setEmail(email);
        }
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(generateUniqueUsername(email));
        }
        user.setGuest(false);
        user.setLastActive(LocalDateTime.now());

        return userRepository.save(user);
    }

    private String generateUniqueUsername(String email) {
        String base = "user";
        if (email != null && email.contains("@")) {
            base = email.substring(0, email.indexOf('@'));
        }

        String candidate = base;
        int attempt = 0;
        while (userRepository.existsByUsername(candidate)) {
            attempt++;
            candidate = base + "_" + attempt;
        }
        return candidate;
    }

    public void deleteUser(UUID id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public User registerLocalUser(String name, String username, String email, String rawPassword) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("Email already exists");
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalStateException("Username already exists");
        }

        User user = User.builder()
                .name(name)
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .isGuest(false)
                .lastActive(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    public User authenticateLocalUser(String email, String rawPassword) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (user.getPasswordHash() == null ||
                !passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        user.setLastActive(LocalDateTime.now());
        return userRepository.save(user);
    }
}