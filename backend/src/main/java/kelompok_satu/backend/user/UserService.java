package kelompok_satu.backend.user;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    public void deleteUser(UUID id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}