package org.endipi.user.repository;

import org.endipi.user.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    // Excel import validation methods
    @Query("SELECT s.studentCode FROM Student s WHERE s.studentCode IN :codes")
    List<String> findStudentCodesByStudentCodeIn(@Param("codes") List<String> codes);

    boolean existsByStudentCode(String studentCode);
}
