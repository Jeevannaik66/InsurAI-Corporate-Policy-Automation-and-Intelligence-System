package com.insurai.insurai_backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai_backend.config.JwtUtil;
import com.insurai.insurai_backend.model.Claim;
import com.insurai.insurai_backend.model.Hr;
import com.insurai.insurai_backend.model.LoginRequest;
import com.insurai.insurai_backend.repository.HrRepository;
import com.insurai.insurai_backend.service.ClaimService;
import com.insurai.insurai_backend.service.HrService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/hr")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class HrController {

    private final HrService hrService;
    private final HrRepository hrRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ClaimService claimService;

    // ================= HR Login =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Hr hr = hrRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("HR not found"));

        if (!passwordEncoder.matches(request.getPassword(), hr.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(hr.getEmail(), "HR");

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", "HR",
                "name", hr.getName(),
                "id", hr.getId()
        ));
    }

    // ================= Get All HRs =================
    @GetMapping
    public ResponseEntity<List<Hr>> getAllHRs() {
        return ResponseEntity.ok(hrRepository.findAll());
    }

    // ================= Get Claims Assigned to Logged-in HR =================
    @GetMapping("/claims")
    public ResponseEntity<?> getAssignedClaims(@RequestHeader(value = "Authorization") String authHeader) {
        try {
            validateHrToken(authHeader);
            String token = authHeader.substring(7).trim();
            String hrEmail = jwtUtil.extractUsername(token);

            Hr hr = hrRepository.findByEmail(hrEmail)
                    .orElseThrow(() -> new RuntimeException("HR not found"));

            // Fetch only claims assigned to this HR
            List<Claim> claims = claimService.getClaimsByAssignedHr(hr.getId());
            List<ClaimDTO> dtos = claims.stream()
                    .map(ClaimDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(403).body("Error fetching claims: " + e.getMessage());
        }
    }

  // Approve a claim with remarks
@PostMapping("/claims/approve/{claimId}")
public ResponseEntity<?> approveClaim(
        @PathVariable Long claimId,
        @RequestBody Map<String, String> body,
        @RequestHeader(value = "Authorization") String authHeader) {
    try {
        validateHrToken(authHeader);

        String remarks = body.get("remarks"); // <-- get from JSON body
        Claim claim = claimService.getClaimById(claimId);
        claim.setStatus("Approved");
        claim.setRemarks(remarks);
        claim.setUpdatedAt(LocalDateTime.now());
        Claim updated = claimService.updateClaim(claim);

        return ResponseEntity.ok(new ClaimDTO(updated));
    } catch (Exception e) {
        return ResponseEntity.status(400).body("Error approving claim: " + e.getMessage());
    }
}

// Reject a claim with remarks
@PostMapping("/claims/reject/{claimId}")
public ResponseEntity<?> rejectClaim(
        @PathVariable Long claimId,
        @RequestBody Map<String, String> body,
        @RequestHeader(value = "Authorization") String authHeader) {
    try {
        validateHrToken(authHeader);

        String remarks = body.get("remarks"); // <-- get from JSON body
        Claim claim = claimService.getClaimById(claimId);
        claim.setStatus("Rejected");
        claim.setRemarks(remarks);
        claim.setUpdatedAt(LocalDateTime.now());
        Claim updated = claimService.updateClaim(claim);

        return ResponseEntity.ok(new ClaimDTO(updated));
    } catch (Exception e) {
        return ResponseEntity.status(400).body("Error rejecting claim: " + e.getMessage());
    }
}


    // ================= Helper to validate HR token =================
    private void validateHrToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7).trim();
        String role = jwtUtil.extractRole(token);
        if (!"HR".equalsIgnoreCase(role)) {
            throw new RuntimeException("Unauthorized: not an HR");
        }
    }

    // ================= ClaimDTO =================
    public static class ClaimDTO {
        private Long id;
        private String title;
        private String description;
        private Double amount;
        private String status;
        private String remarks;
        private LocalDateTime claimDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long employeeId;
        private Long policyId;
        private String policyName;  // <-- New field
        private List<String> documents;
        private Long assignedHrId;

        public ClaimDTO(Claim claim) {
            this.id = claim.getId();
            this.title = claim.getTitle();
            this.description = claim.getDescription();
            this.amount = claim.getAmount();
            this.status = claim.getStatus();
            this.remarks = claim.getRemarks();
            this.claimDate = claim.getClaimDate();
            this.createdAt = claim.getCreatedAt();
            this.updatedAt = claim.getUpdatedAt();
            this.employeeId = (claim.getEmployee() != null) ? claim.getEmployee().getId() : null;
            this.policyId = (claim.getPolicy() != null) ? claim.getPolicy().getId() : null;
            this.policyName = (claim.getPolicy() != null) ? claim.getPolicy().getPolicyName() : "N/A";
            this.documents = claim.getDocuments();
            this.assignedHrId = (claim.getAssignedHr() != null) ? claim.getAssignedHr().getId() : null;
        }

        // Getters
        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public Double getAmount() { return amount; }
        public String getStatus() { return status; }
        public String getRemarks() { return remarks; }
        public LocalDateTime getClaimDate() { return claimDate; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public Long getEmployeeId() { return employeeId; }
        public Long getPolicyId() { return policyId; }
        public String getPolicyName() { return policyName; }
        public List<String> getDocuments() { return documents; }
        public Long getAssignedHrId() { return assignedHrId; }
    }
}
