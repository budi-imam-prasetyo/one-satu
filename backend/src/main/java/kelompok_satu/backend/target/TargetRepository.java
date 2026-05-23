package kelompok_satu.backend.target;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TargetRepository extends JpaRepository<Target, UUID> {
}
