package com.insurai.insurai_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai_backend.model.Policy;
import com.insurai.insurai_backend.service.AdminService;
import com.insurai.insurai_backend.service.PolicyService;

@RestController
@RequestMapping("/admin/policies")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PolicyController {

    private final PolicyService policyService;
    private final AdminService adminService;

    @Autowired
    public PolicyController(PolicyService policyService, AdminService adminService) {
        this.policyService = policyService;
        this.adminService = adminService;
    }

    // -------------------- Create a new policy (Admin only) --------------------
    @PostMapping
    public ResponseEntity<?> createPolicy(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                          @RequestBody Policy policy) {

        if (!adminService.isAdmin(authHeader)) {
            return ResponseEntity.status(403).body("Access denied. Please login as Admin.");
        }

        Policy createdPolicy = policyService.createPolicy(policy);
        return ResponseEntity.ok(createdPolicy);
    }

    // -------------------- Get all policies (Admin only) --------------------
    @GetMapping
    public ResponseEntity<?> getAllPolicies(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!adminService.isAdmin(authHeader)) {
            return ResponseEntity.status(403).body("Access denied. Please login as Admin.");
        }
        List<Policy> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(policies);
    }

    // -------------------- Get active policies (Admin only) --------------------
    @GetMapping("/active")
    public ResponseEntity<?> getActivePolicies(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (!adminService.isAdmin(authHeader)) {
            return ResponseEntity.status(403).body("Access denied. Please login as Admin.");
        }
        List<Policy> activePolicies = policyService.getActivePolicies();
        return ResponseEntity.ok(activePolicies);
    }

    // -------------------- Get policy by ID (Admin only) --------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getPolicyById(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                           @PathVariable Long id) {
        if (!adminService.isAdmin(authHeader)) {
            return ResponseEntity.status(403).body("Access denied. Please login as Admin.");
        }
        Policy policy = policyService.getPolicyById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id " + id));
        return ResponseEntity.ok(policy);
    }

    // -------------------- Update policy (Admin only) --------------------
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePolicy(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                          @PathVariable Long id,
                                          @RequestBody Policy updatedPolicy) {
        if (!adminService.isAdmin(authHeader)) {
            return ResponseEntity.status(403).body("Access denied. Please login as Admin.");
        }
        Policy policy = policyService.updatePolicy(id, updatedPolicy);
        return ResponseEntity.ok(policy);
    }

    // -------------------- Delete policy (Admin only) --------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePolicy(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                          @PathVariable Long id) {
        if (!adminService.isAdmin(authHeader)) {
            return ResponseEntity.status(403).body("Access denied. Please login as Admin.");
        }
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }
}
