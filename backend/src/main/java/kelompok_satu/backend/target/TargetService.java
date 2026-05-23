package kelompok_satu.backend.target;

import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import kelompok_satu.backend.user.User;
import kelompok_satu.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Service
public class TargetService {

    @Autowired
    private TargetRepository targetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Validator validator;



//    public TargetService(TargetRepository targetRepository, UserRepository userRepository) {
//        this.targetRepository = targetRepository;
//        this.userRepository = userRepository;
//    }

    @Transactional
    public TargetResponse create(User principal, CreateTargetRequest request) {
        Set<ConstraintViolation<CreateTargetRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        if (principal == null || principal.getId() == null) {
            throw new RuntimeException("Unauthorized");
        }

        LocalDate deadline = request.deadline();
        if (deadline != null && deadline.isBefore(LocalDate.now())) {
            throw new RuntimeException("Deadline cannot be in the past");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Target target = new Target();
        target.setUser(user);
        target.setTitle(request.title().trim());
//        target.setDescription(request.description());
        target.setImageUrl(request.imageUrl());
        target.setTargetAmount(request.targetAmount());
        target.setCurrentAmount(BigDecimal.ZERO);
        target.setStatus(TargetStatus.ACTIVE);
        target.setFrequency(request.frequency());
        target.setFrequencyAmount(request.frequencyAmount());
        target.setDeadline(deadline);



        targetRepository.save(target);
        return toResponse(target);
    }

    private TargetResponse toResponse(Target target) {

        return new TargetResponse(
                target.getId(),
                target.getUser().getId(),
                target.getImageUrl(),
//                target.getDescription(),
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
