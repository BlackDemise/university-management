package org.endipi.academic.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.endipi.academic.consumer.data.TeacherEvent;
import org.endipi.academic.service.DepartmentMemberService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeacherEventConsumer {
    private final DepartmentMemberService departmentMemberService;

    @KafkaListener(topics = "${kafka.topic.teacher-events}")
    public void handleTeacherEvent(TeacherEvent event) {
        log.info("Received teacher event: {} for user: {}", event.getEventType(), event.getUserId());

        try {
            switch (event.getEventType()) {
                case "TEACHER_REMOVED":
                case "TEACHER_ROLE_REMOVED":
                    handleTeacherRemoval(event);
                    break;
                default:
                    log.warn("Unknown teacher event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing teacher event: {}", event, e);
            // Implement error handling strategy (retry, DLQ, etc.)
        }
    }

    private void handleTeacherRemoval(TeacherEvent event) {
        log.info("Removing all department memberships for teacher: {} (user: {})",
                event.getTeacherCode(), event.getUserId());

        // Remove by userId (since that's what we store in DepartmentMember.teacherId)
        departmentMemberService.deleteAllByTeacherId(event.getUserId());

        log.info("Successfully removed department memberships for: {}", event.getFullName());
    }
}