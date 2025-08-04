package org.endipi.enrollment.repository;

import org.endipi.enrollment.entity.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SemesterRepository extends JpaRepository<Semester, Long> {
    // Find all with paging, serves as filter in SemesterList.jsx
    Page<Semester> findByNameContainingIgnoreCase(String trim, Pageable pageable);

    // Find by name, used to validate the uniqueness in SemesterServiceImpl.java
    Optional<Semester> findByName(String name);

    @Query("""
           from Semester s
           where (s.startDate <= :savedStartDate and s.endDate >= :savedStartDate)
           or (s.startDate > :savedStartDate and s.startDate <= :savedEndDate)
           """)
    List<Semester> findOverlappingSemesters(LocalDate savedStartDate, LocalDate savedEndDate);
}
