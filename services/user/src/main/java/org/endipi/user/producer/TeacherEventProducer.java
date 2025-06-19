package org.endipi.user.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.user.entity.User;
import org.endipi.user.producer.data.TeacherEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TeacherEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topic.teacher-events}")
    private String teacherEventsTopic;

    public void publishTeacherRemoved(User user) {
        TeacherEvent event = TeacherEvent.builder()
                .eventType("TEACHER_REMOVED")
                .userId(user.getId())
                .teacherId(user.getTeacher() != null ? user.getTeacher().getId() : null)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .teacherCode(user.getTeacher() != null ? user.getTeacher().getTeacherCode() : null)
                .timestamp(System.currentTimeMillis())
                .build();

        kafkaTemplate.send(teacherEventsTopic, user.getId().toString(), event);
        log.info("Published teacher removed event for user: {}", user.getId());
    }

    public void publishTeacherRoleRemoved(User user) {
        TeacherEvent event = TeacherEvent.builder()
                .eventType("TEACHER_ROLE_REMOVED")
                .userId(user.getId())
                .teacherId(user.getTeacher() != null ? user.getTeacher().getId() : null)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .teacherCode(user.getTeacher() != null ? user.getTeacher().getTeacherCode() : null)
                .timestamp(System.currentTimeMillis())
                .build();

        kafkaTemplate.send(teacherEventsTopic, user.getId().toString(), event);
        log.info("Published teacher role removed event for user: {}", user.getId());
    }
}