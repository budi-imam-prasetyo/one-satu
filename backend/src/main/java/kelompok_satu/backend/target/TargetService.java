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
import java.math.RoundingMode;
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
    public List<TargetResponse> findByUserId(User principal, TargetStatus status) {
        if (principal == null || principal.getId() == null) {
            throw new RuntimeException("Unauthorized");
        }

        List<Target> targets = (status != null) ?
                targetRepository.findByUserIdAndStatus(principal.getId(), status) :
                targetRepository.findByUserId(principal.getId());

        return targets.stream()
                .map(this::toResponse)
                .toList();
    }

    public DashboardStats getDashboardStats(User principal) {
        if (principal == null || principal.getId() == null) {
            throw new RuntimeException("Unauthorized");
        }

        UUID userId = principal.getId();

        BigDecimal totalSavings = targetRepository.sumCurrentAmountByUserId(userId);
        int totalTargets = targetRepository.countByUserId(userId);
        int totalCompleted = targetRepository.countByUserIdAndStatus(userId, TargetStatus.COMPLETED);

        return new DashboardStats(totalSavings, totalTargets, totalCompleted);
    }

    public TargetDetailResponse getDetail(User principal, UUID targetId) {
        if (principal == null || principal.getId() == null) {
            throw new RuntimeException("Unauthorized");
        }

        Target target = targetRepository.findByIdAndUserId(targetId, principal.getId())
                .orElseThrow(() -> new RuntimeException("Target not found"));

        return toDetailResponse(target);
    }



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

    public TargetDetailResponse update(User principal, UUID targetId,
                                       UpdateTargetRequest request,
                                       MultipartFile image) throws IOException {
        Target target = targetRepository.findByIdAndUserId(targetId, principal.getId())
                .orElseThrow(() -> new RuntimeException("Target not found"));

        target.setTitle(request.title().trim());
        target.setTargetAmount(request.targetAmount());
        target.setDeadline(request.deadline());
        target.setFrequency(request.frequency());
        target.setFrequencyAmount(request.frequencyAmount());
        target.setStatus(TargetStatus.ACTIVE);

        // update image
        if(target.getImageUrl() != null) {
            if (image != null && !image.isEmpty()) {
                // User upload image baru → hapus lama, simpan baru
                deleteOldImage(target.getImageUrl());
                validateImage(image);
                target.setImageUrl(saveImage(image));
            } else if (request.imageUrl() != null) {
                // User tidak ubah image → pakai URL lama
                target.setImageUrl(request.imageUrl());
            } else {
                // User hapus image → set null
                deleteOldImage(target.getImageUrl());
                target.setImageUrl(null);
            }
        }


        targetRepository.save(target);
        return toDetailResponse(target);
    }

    public void validateImage(MultipartFile image) {
        if (image == null || image.isEmpty()) return; // opsional, skip jika null

        if (image.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("Maximum size of image is 5MB");
        }

        if (!ALLOWED_TYPES.contains(image.getContentType())) {
            throw new IllegalArgumentException("File format must be PNG, jpg/jpeg");
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

    public void deleteOldImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;

        try {
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path oldFile = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(oldFile);
            log.info("Old image deleted: {}", filename);
        } catch (IOException e) {
            log.warn("Failed delete old image: {}", e.getMessage());
        }
    }

    @Transactional
    public void delete(User principal, UUID targetId) {
        Target target = targetRepository.findByIdAndUserId(targetId, principal.getId())
                .orElseThrow(()->new RuntimeException("Target not found"));

        deleteOldImage(target.getImageUrl());

        targetRepository.delete(target);
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

    private TargetDetailResponse toDetailResponse(Target target) {
        BigDecimal remaining = target.getTargetAmount()
                .subtract(target.getCurrentAmount())
                .max(BigDecimal.ZERO);

        int progress = target.getTargetAmount().compareTo(BigDecimal.ZERO) == 0 ? 0
                : target.getCurrentAmount()
                  .multiply(BigDecimal.valueOf(100))
                  .divide(target.getTargetAmount(), 0, RoundingMode.FLOOR)
                  .min(BigDecimal.valueOf(100))
                  .intValue();

        return new TargetDetailResponse(
                target.getId(),
                target.getUser().getId(),
                target.getTitle(),
                target.getImageUrl(),
                target.getStatus(),
                target.getTargetAmount(),
                target.getCurrentAmount(),
                remaining,
                progress,
                target.getFrequency(),
                target.getFrequencyAmount(),
                target.getDeadline()
        );
    }
}
