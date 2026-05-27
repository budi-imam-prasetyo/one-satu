package kelompok_satu.backend.notification;

import kelompok_satu.backend.target.Target;
import kelompok_satu.backend.target.TargetFrequency;
import kelompok_satu.backend.target.TargetRepository;
import kelompok_satu.backend.target.TargetStatus;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.chrono.ChronoLocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationSheduler {
    private static final Logger logger = LoggerFactory.getLogger(NotificationSheduler.class);

    private final TargetRepository targetRepository;
    private final NotificationService notificationService;

    //cek setiap menit
    @Scheduled(cron = "0 * * * * *")
    public void sendReminders(){
        LocalDate today = LocalDate.now();
        LocalDate now = LocalDate.now();

        List<Target> targets = targetRepository
                .findActiveTargetsToNotify(TargetStatus.ACTIVE, today);

        for (Target target : targets){
            if(!now.isBefore(ChronoLocalDate.from(target.getNotifyAt()))){
                logger.info("Sending reminder for target: {}", target.getTitle());
                notificationService.createReminder(target);
            }
        }
    }

    private  LocalDate calculaeNextNotifyDate(
            LocalDate from,
            TargetFrequency frequency
    ){
        return switch (frequency){
            case DAILY -> from.plusDays(1);
            case WEEKLY -> from.plusWeeks(1);
            case MONTHLY -> from.plusMonths(1);
        };
    }
}
