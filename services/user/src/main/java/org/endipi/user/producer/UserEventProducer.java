package org.endipi.user.producer;

import lombok.RequiredArgsConstructor;
import org.endipi.user.entity.User;
import org.endipi.user.producer.data.UserEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topic.user-events}")
    private String userEventsTopic;

    public void publishUserCreated(User user) {
        UserEvent event = UserEvent.builder()
                .eventType("CREATE")
                .userId(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole().getRoleTitle().name())
                .timestamp(System.currentTimeMillis())
                .build();

        kafkaTemplate.send(userEventsTopic, user.getId().toString(), event);
    }

    public void publishUserUpdated(User user) {
        UserEvent event = UserEvent.builder()
                .eventType("UPDATE")
                .userId(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole().getRoleTitle().name())
                .timestamp(System.currentTimeMillis())
                .build();

        kafkaTemplate.send(userEventsTopic, user.getId().toString(), event);
    }

    public void publishUserDeleted(User user) {
        UserEvent event = UserEvent.builder()
                .eventType("DELETE")
                .userId(user.getId())
                .email(user.getEmail())
                .timestamp(System.currentTimeMillis())
                .build();

        kafkaTemplate.send(userEventsTopic, user.getId().toString(), event);
    }
}
