package kelompok_satu.backend.target;

import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import kelompok_satu.backend.infrastructure.response.WebResponse;
import kelompok_satu.backend.user.User;
import kelompok_satu.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class TargetService {

    @Autowired
    private TargetRepository targetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Validator validator;

    private static final Logger log = LoggerFactory.getLogger(TargetService.class);

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = List.of(
            "image/png", "image/jpeg"
    );


    @Transactional
    public TargetResponse create(User principal, CreateTargetRequest request, MultipartFile image) throws IOException {
        Set<ConstraintViolation<CreateTargetRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        if (principal == null || principal.getId() == null) {
            throw new RuntimeException("Unauthorized");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            log.info("Image received: {}", image.getOriginalFilename());
            validateImage(image);
            imageUrl = saveImage(image);
        } else {
            log.warn("No image uploaded");
        }

        Target target = new Target();
        target.setUser(user);
        target.setTitle(request.title().trim());
        target.setImageUrl(imageUrl);
        target.setTargetAmount(request.targetAmount());
        target.setCurrentAmount(BigDecimal.ZERO);
        target.setStatus(TargetStatus.ACTIVE);
        target.setFrequency(request.frequency());
        target.setFrequencyAmount(request.frequencyAmount());
        target.setDeadline(request.deadline());



        targetRepository.save(target);
        return toResponse(target);
    }

    public void validateImage(MultipartFile image) {
        if (image == null || image.isEmpty()) return; // opsional, skip jika null

        if (image.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("Ukuran gambar maksimal 5MB");
        }

        if (!ALLOWED_TYPES.contains(image.getContentType())) {
            throw new IllegalArgumentException("Format harus PNG atau JPEG");
        }
    }

    public String saveImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        log.info("Saving image to directory: {}", uploadPath.toAbsolutePath());
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
        log.info("Upload directory created/verified");

        String original = StringUtils.cleanPath(
                Objects.requireNonNull(file.getOriginalFilename())
        );
        String ext = original.contains(".")
                ? original.substring(original.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID() + ext;
        log.info("Generated filename: {}", filename);

        Path targetPath = uploadPath.resolve(filename);
        log.info("Target file path: {}", targetPath.toAbsolutePath());
        Files.copy(file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING);
        log.info("File saved successfully at: {}", targetPath.toAbsolutePath());

        // Return full URL, bukan hanya filename
        String fullUrl = baseUrl + "/uploads/" + filename;
        log.info("Returning image URL: {}", fullUrl);
        return fullUrl;
    }

    private TargetResponse toResponse(Target target) {

        return new TargetResponse(
                target.getId(),
                target.getUser().getId(),
                target.getTitle(),
                target.getImageUrl(),
                target.getStatus(),
                target.getTargetAmount(),
                target.getCurrentAmount(),
                target.getFrequency(),
                target.getFrequencyAmount(),
                target.getDeadline()
        );
    }
}
