/**
 * API Service module that exports all service modules
 * This allows for a centralized import of all API services
 * 
 * Usage example:
 * import { authService, userService, majorService, courseService, departmentMemberService } from '../services/apiService';
 */
import authService from "./authService.js";
import userService from "./userService.js";
import majorService from "./majorService.js";
import courseService from "./courseService.js";
import programCurriculumService from "./programCurriculumService.js";
import classroomService from "./classroomService.js";
import departmentMemberService from "./departmentMemberService.js";

export {
  authService,
  userService,
  majorService,
  courseService,
  programCurriculumService,
  classroomService,
  departmentMemberService
}; 