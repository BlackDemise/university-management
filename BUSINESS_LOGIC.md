# University Management Microservices - Business Logic Analysis

## Overview
This document analyzes the business logic implementation across all entities in the university management microservices system, comparing current implementation with required business rules.

## Legend
- ✅ **IMPLEMENTED**: Business rule is already implemented
- ❌ **MISSING**: Business rule is not implemented
- ⚠️ **PARTIAL**: Business rule is partially implemented
- 🔄 **TODO**: Marked as TODO in code comments

---

## Entity-by-Entity Analysis

### 1. **Attendance** (Assessment Service)
**Domain**: Student attendance tracking for scheduled sessions

#### Current Implementation:
- ✅ Basic entity structure with StudentId, Schedule reference
- ✅ AttendanceStatus enum
- ✅ Service validation framework
- ✅ Student existence validation: Student must exist
- ✅ Schedule existence validation: Schedule must exist
- ✅ Unique constraint: (Student, Schedule) must be unique - no duplicate attendance records
- ✅ Repository method: `existsByStudentIdAndScheduleId()`
- ✅ Time window validation**: Attendance can only be taken within [Schedule.startTime, end of day]. After that, record becomes read-only

### 2. **BlacklistedToken** (Auth Service)
**Domain**: Security token management

#### Current Implementation:
- ✅ Token field with unique constraint
- ✅ TokenType enum
- ✅ ExpiryDate field

#### Business Logic:
- ✅ **No business logic required** - Security-only entity
- ✅ Unique token constraint already implemented: `@Column(unique = true, nullable = false)`

---

### 3. **Classroom** (Facility Service)
**Domain**: Physical classroom management

#### Current Implementation:
- ✅ Basic entity structure
- ✅ ClassroomType enum
- ✅ Capacity, equipment fields

#### Business Logic:
- ✅ **No complex business logic required** - Referenced-only entity
- ✅ Service validation exists for external references

---

### 4. **Course** (Academic Service)
**Domain**: Academic course definitions

#### Current Implementation:
- ✅ Basic entity structure
- ✅ Course code, name, credits (theory/practical)
- ✅ CourseType enum
- ✅ Relationships to ProgramCurriculum and PrerequisiteCourse

#### Business Logic:
- ✅ **No complex business logic required** - Referenced-only entity
- ✅ Credits validation could be added (>= 0) but not strictly required

---

### 5. **CourseOffering** (Enrollment Service)
**Domain**: Specific instances of courses offered in semesters

#### Current Implementation:
- ✅ External service validation for Course, Teacher, Classroom
- ✅ Semester validation
- ✅ Basic entity structure with maxStudents, currentStudents
- ⚠️ Retry mechanism with optimistic locking

#### Required Business Logic:
- ✅ **Course existence**: Validated via CourseServiceClient
- ✅ **Semester existence**: Validated via repository check
- ✅ **Teacher existence**: Validated via UserServiceClient  
- ✅ **Classroom existence**: Validated via ClassroomServiceClient
- ✅ **Capacity management**: When currentStudents == maxStudents, should become read-only
- ✅ **Unique constraint**: (Course, Semester, Teacher, Classroom) must be unique
- ✅ **Registration period**: openTime - closeTime fields missing
- ✅ **Current students calculation**: Should be calculated from CourseRegistration count

### 6. **CourseRegistration** (Enrollment Service)
**Domain**: Student registrations for course offerings

#### Current Implementation:
- ✅ External student validation via UserServiceClient
- ✅ CourseOffering existence validation
- ✅ RegistrationDate auto-set for new registrations
- ✅ CourseRegistrationStatus enum

#### Required Business Logic:
- ✅ **Student existence**: Validated via UserServiceClient
- ✅ **CourseOffering existence**: Validated via repository
- ✅ **Unique constraint**: (Student, CourseOffering) must be unique
- ✅ **Registration period validation**: Check against CourseOffering.openTime/closeTime
- ✅ **Capacity validation**: Check if CourseOffering has available slots
- ✅ **Read-only after registration period**: Status becomes immutable after closeTime

### 7. **Department** (Academic Service)
**Domain**: Academic department organization

#### Current Implementation:
- ✅ Basic entity structure
- ✅ Relationships to Major and DepartmentMember

#### Business Logic:
- ✅ **No complex business logic required** - Referenced-only entity

---

### 8. **DepartmentMember** (Academic Service)
**Domain**: N-N relationship between Department and Teacher

#### Current Implementation:
- ✅ Unique constraint: `@UniqueConstraint(columnNames = {"department_id", "teacher_id"})`
- ✅ DepartmentMemberType enum
- ✅ Start/end date fields
- ✅ Event-driven cleanup via TeacherEventConsumer

#### Business Logic:
- ✅ **N-N relationship logic**: Properly enforced with unique constraint
- ✅ **Teacher removal handling**: Automated via Kafka events

---

### 9. **Grade** (Assessment Service)
**Domain**: Student grades for course registrations

#### Current Implementation:
- ✅ ScoreType enum
- ✅ Score validation: Range [0.0, 10.0] implemented
- ✅ CourseRegistration reference

#### Required Business Logic:
- ✅ **ScoreValue range**: [0.0, 10.0] validation implemented
- ✅ **CourseRegistration existence**: Marked as TODO
- ✅ **Unique constraint**: (CourseRegistration, ScoreType) to prevent duplicate grades

### 10. **Major** (Academic Service)
**Domain**: Academic major programs

#### Current Implementation:
- ✅ Department reference validation
- ✅ totalCreditsRequired field
- ✅ Relationship to ProgramCurriculum

#### Required Business Logic:
- ✅ **Department existence**: Should be validated (not currently implemented)
- ✅ **totalCreditsRequired >= 0**: Validation missing

### 11. **PrerequisiteCourse** (Academic Service)
**Domain**: Course prerequisite relationships

#### Current Implementation:
- ✅ Basic N-N relationship structure
- ❌ **Circular dependency prevention**: Noted in `note/note.txt` as known issue

#### Required Business Logic:
- ❌ **Circular dependency validation**: Prevent cycles in prerequisite chains
- ❌ **Self-reference prevention**: Course can't be prerequisite of itself

#### Known Issues (from note.txt):
```
There is a case that a circular dependency lasts more than 2 levels.
Currently, this is not prevented; implement proper strategies after completing the project.
```

---

### 12. **ProgramCurriculum** (Academic Service)
**Domain**: N-N relationship between Course and Major

#### Current Implementation:
- ✅ Unique constraint: `@UniqueConstraint(columnNames = {"course_id", "major_id"})`
- ✅ semesterRecommended field
- ✅ isMandatory field

#### Required Business Logic:
- ✅ **(Course, Major) uniqueness**: Already implemented
- ✅ **semesterRecommended >= 0**: Validation missing

### 13. **Role** (User Service)
**Domain**: User role management

#### Current Implementation:
- ✅ RoleTitle enum
- ✅ Relationship to User

#### Business Logic:
- ✅ **No complex business logic required** - Security-only entity

---

### 14. **Schedule** (Assessment Service)
**Domain**: Class session scheduling

#### Current Implementation:
- ✅ SessionType enum
- ✅ sessionNumber field
- ✅ startTime, endTime fields
- ✅ CourseOffering and Classroom references

#### Required Business Logic:
- ❌ **sessionNumber >= 1**: Validation missing
- ❌ **CourseOffering existence**: Should be validated
- ❌ **Classroom existence**: Should be validated
- ❌ **(CourseOffering, Classroom) uniqueness**: Missing constraint
- ❌ **PeriodDuration extraction**: Should move startTime/endTime to separate table
- ❌ **Schedule overlap validation**: Same classroom can't have overlapping schedules


#### Major Missing Implementation:
```java
// Should extract time periods to prevent overlaps
@Entity
public class PeriodDuration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}

// Then Schedule references PeriodDuration
@ManyToOne
@JoinColumn(name = "period_duration_id")
private PeriodDuration periodDuration;
```

---

### 15. **Semester** (Enrollment Service)
**Domain**: Academic semester periods

#### Current Implementation:
- ✅ startDate < endDate validation implemented
- ✅ Basic entity structure
- ✅ Relationship to CourseOffering

#### Required Business Logic:
- ✅ **startDate < endDate**: Implemented in SemesterServiceImpl
- ❌ **Name uniqueness**: Marked as TODO
- ❌ **Overlapping semester prevention**: Marked as TODO

---

### 16. **Student** (User Service)
**Domain**: Student-specific information

#### Current Implementation:
- ✅ User relationship with unique constraint
- ✅ StudentStatus enum
- ⚠️ Department reference exists (optimization needed)

#### Required Business Logic:
- ✅ **User existence**: OneToOne relationship enforces this
- ❌ **StudentCode uniqueness**: Missing validation
- ❌ **User nullability**: userId = null should be invalid
- ❌ **Department optimization**: Can be inferred from Major (noted in note.txt)
- ❌ **(User, Department) uniqueness**: Missing constraint

#### Missing Implementation:
```java
@Column(unique = true, nullable = false)
private String studentCode;

// Consider removing department field as noted:
// "Student -> Major is enough. Major belongs to Department"
```

---

### 17. **Teacher** (User Service)
**Domain**: Teacher-specific information

#### Current Implementation:
- ✅ User relationship with unique constraint
- ✅ academicRank, degree fields

#### Required Business Logic:
- ✅ **User existence**: OneToOne relationship enforces this
- ✅ **TeacherCode uniqueness**: Missing validation
- ❌ **User nullability**: userId = null should be invalid

#### Missing Implementation:
```java
@Column(unique = true, nullable = false)
private String teacherCode;
```

---

### 18. **User** (User Service)
**Domain**: Core user information

#### Current Implementation:
- ✅ Complex role-based entity management
- ✅ Event-driven architecture for user changes
- ✅ Teacher/Student lifecycle management
- ✅ Role change handling with cleanup

#### Required Business Logic:
- ✅ **Role existence**: Validated via repository
- ✅ **Email uniqueness**: Missing constraint
- ✅ **One role per user**: Enforced in service logic

#### Missing Implementation:
```java
@Column(unique = true, nullable = false)
private String email;
```

---

## Summary of Major Missing Features

### 1. **Unique Constraints**
Many entities are missing critical unique constraints:
- Attendance: (studentId, scheduleId)
- CourseOffering: (courseId, semesterId, teacherId, classroomId)  
- CourseRegistration: (studentId, courseOfferingId)
- Grade: (courseRegistrationId, scoreType)
- Schedule: (courseOfferingId, classroomId)
- Student: studentCode
- Teacher: teacherCode
- User: email

### 2. **PeriodDuration Table** 
Critical for preventing schedule overlaps:
```sql
CREATE TABLE period_duration (
    id BIGINT PRIMARY KEY,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);
```

### 3. **Registration Period Management**
CourseOffering needs:
- openTime field
- closeTime field  
- Registration period validation
- Read-only status after closeTime

### 4. **Capacity Management**
CourseOffering needs:
- Dynamic currentStudents calculation
- Read-only when full
- Registration blocking when at capacity

### 5. **Cross-Service Validations**
Many TODO items for service-to-service validation calls that need implementation.

### 6. **Circular Dependency Prevention**
PrerequisiteCourse needs algorithm to detect and prevent circular dependencies.

---

## Next Steps for Implementation

1. **Add Missing Unique Constraints** (Database level)
2. **Implement PeriodDuration Table** (Prevent schedule overlaps)
3. **Add Registration Period Fields** (CourseOffering time windows)
4. **Implement Capacity Management** (Dynamic student counting)
5. **Complete Cross-Service Validations** (Remove TODO comments)
6. **Add Circular Dependency Detection** (PrerequisiteCourse)
7. **Optimize Student Entity** (Remove redundant Department field)

This analysis provides a complete roadmap for implementing the missing business logic while maintaining the microservices architecture and learning objectives. 