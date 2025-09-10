package com.insurai.insurai_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai_backend.model.LoginRequest;
import com.insurai.insurai_backend.model.RegisterRequest;
import com.insurai.insurai_backend.service.AdminService;
import com.insurai.insurai_backend.service.PolicyService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173") // React frontend
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PolicyService policyService;

    // -------------------- Admin Login --------------------
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        if (adminService.validateAdmin(email, password)) {
            String token = adminService.generateAdminToken(email);
            return ResponseEntity.ok(new LoginResponse(
                    "Login successful",
                    adminService.getAdminName(email),
                    "ADMIN",
                    token
            ));
        } else {
            return ResponseEntity.status(403).body("Invalid admin credentials");
        }
    }

    // -------------------- Register Agent --------------------
    @PostMapping("/agent/register")
    public ResponseEntity<?> registerAgent(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody RegisterRequest registerRequest) {

        if (!adminService.isAdmin(authHeader)) {
            return ResponseEntity.status(403).body("Access denied. Please login as Admin.");
        }

        adminService.registerAgent(registerRequest);
        return ResponseEntity.ok("Agent registered successfully");
    }

    // -------------------- Register HR --------------------
    @PostMapping("/hr/register")
    public ResponseEntity<?> registerHR(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody RegisterRequest registerRequest) {

        if (!adminService.isAdmin(authHeader)) {
            return ResponseEntity.status(403).body("Access denied. Please login as Admin.");
        }

        adminService.registerHR(registerRequest);
        return ResponseEntity.ok("HR registered successfully");
    }

    // -------------------- Inner class for login response --------------------
    public static class LoginResponse {
        private String message;
        private String name;
        private String role;
        private String token;

        public LoginResponse(String message, String name, String role, String token) {
            this.message = message;
            this.name = name;
            this.role = role;
            this.token = token;
        }

        public String getMessage() { return message; }
        public String getName() { return name; }
        public String getRole() { return role; }
        public String getToken() { return token; }
    }
}
