package org.endipi.auth.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.auth.consumer.data.UserEvent;
import org.endipi.auth.entity.AuthUser;
import org.endipi.auth.repository.AuthUserRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserEventConsumer {
    private final AuthUserRepository authUserRepository;

    @KafkaListener(topics = "${kafka.topic.user-events}")
    public void handleUserEvent(UserEvent event) {
        log.info("Received user event: {}", event);

        try {
            switch (event.getEventType()) {
                case "CREATE":
                    handleUserCreated(event);
                    break;
                case "UPDATE":
                    handleUserUpdated(event);
                    break;
                case "DELETE":
                    handleUserDeleted(event);
                    break;
                default:
                    log.warn("Unknown event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing user event: {}", event, e);
            // Implement error handling strategy (retry, DLQ, etc.)
        }
    }

    private void handleUserCreated(UserEvent event) {
        AuthUser authUser = AuthUser.builder()
                .email(event.getEmail())
                .password(event.getPassword())
                .role(event.getRole())
                .build();
        authUserRepository.save(authUser);
    }

    private void handleUserUpdated(UserEvent event) {
        authUserRepository.findByEmail(event.getEmail())
                .ifPresent(authUser -> {
                    authUser.setPassword(event.getPassword());
                    authUser.setRole(event.getRole());
                    authUserRepository.save(authUser);
                });
    }

    private void handleUserDeleted(UserEvent event) {
        authUserRepository.findByEmail(event.getEmail())
                .ifPresent(authUserRepository::delete);
    }
}
