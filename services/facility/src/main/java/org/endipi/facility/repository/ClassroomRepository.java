package org.endipi.facility.repository;

import org.endipi.facility.entity.Classroom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    Page<Classroom> findByRoomNumberContainingIgnoreCase(String roomNumber, Pageable pageable);

    Page<Classroom> findByBuildingContainingIgnoreCase(String building, Pageable pageable);
}
