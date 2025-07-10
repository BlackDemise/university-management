package org.endipi.user.repository;

import org.endipi.user.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    // Excel import validation methods
    @Query("SELECT t.teacherCode FROM Teacher t WHERE t.teacherCode IN :codes")
    List<String> findTeacherCodesByTeacherCodeIn(@Param("codes") List<String> codes);

    boolean existsByTeacherCode(String teacherCode);
}
