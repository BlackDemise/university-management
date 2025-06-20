package org.endipi.facility.entity;

import jakarta.persistence.*;
import lombok.*;
import org.endipi.facility.enums.classroom.ClassroomType;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;

    private String building;

    private Integer capacity;

    private String equipment;

    @Enumerated(EnumType.STRING)
    private ClassroomType classroomType;
}