/**
 * API Service module that exports all service modules
 * This allows for a centralized import of all API services
 * 
 * Usage example:
 * import { authService, userService } from '../services/apiService';
 */
import authService from "./authService.js";
import userService from "./userService.js";

export {
  authService,
  userService
}; 