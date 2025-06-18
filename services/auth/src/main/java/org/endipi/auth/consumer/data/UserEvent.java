package org.endipi.auth.consumer.data;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEvent {
    private String eventType; // CREATE, UPDATE, DELETE
    private Long userId;
    private String email;
    private String password; // only for CREATE/UPDATE
    private String role;      // only for CREATE/UPDATE
    private Long timestamp;
}