package com.insurai.insurai_backend.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.insurai.insurai_backend.model.Claim;
import com.insurai.insurai_backend.model.Employee;
import com.insurai.insurai_backend.model.Hr;
import com.insurai.insurai_backend.repository.ClaimRepository;
import com.insurai.insurai_backend.service.HrService;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private HrService hrService;

    /**
     * Submit a new claim with automatic HR assignment
     */
    public Claim submitClaim(Claim claim) throws Exception {
        // Validate claim amount against policy coverage
        if (claim.getAmount() > claim.getPolicy().getCoverageAmount()) {
            throw new Exception("Claim amount exceeds policy coverage!");
        }

        claim.setStatus("Pending");
        claim.setCreatedAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());

        if (claim.getClaimDate() == null) {
            claim.setClaimDate(LocalDateTime.now());
        }

        // ---------------- Automatic HR assignment ----------------
        List<Hr> activeHrs = hrService.getAllActiveHrs();
        if (!activeHrs.isEmpty()) {
            Hr selectedHr = activeHrs.stream()
                    .min(Comparator.comparingInt(hr -> getPendingClaimCount(hr)))
                    .orElse(null);
            claim.setAssignedHr(selectedHr);
        }

        return claimRepository.save(claim);
    }

    /**
     * Get pending claim count for a specific HR
     */
    private int getPendingClaimCount(Hr hr) {
        return claimRepository.countByAssignedHrAndStatus(hr, "Pending");
    }

    /**
     * Get all claims submitted by an Employee entity
     */
    public List<Claim> getClaimsByEmployee(Employee employee) {
        return claimRepository.findByEmployee(employee);
    }

    /**
     * Get all claims submitted by employee ID
     */
    public List<Claim> getClaimsByEmployeeId(String employeeId) {
        return claimRepository.findByEmployee_EmployeeId(employeeId);
    }

    /**
     * Get all claims for admin/HR
     */
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    /**
     * Approve a claim by ID
     */
    public Claim approveClaim(Long claimId, String remarks) throws Exception {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new Exception("Claim not found"));

        claim.setStatus("Approved");
        claim.setRemarks(remarks);
        claim.setUpdatedAt(LocalDateTime.now());
        return claimRepository.save(claim);
    }

    /**
     * Reject a claim by ID
     */
    public Claim rejectClaim(Long claimId, String remarks) throws Exception {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new Exception("Claim not found"));

        claim.setStatus("Rejected");
        claim.setRemarks(remarks);
        claim.setUpdatedAt(LocalDateTime.now());
        return claimRepository.save(claim);
    }

    /**
     * Get claims by status
     */
    public List<Claim> getClaimsByStatus(String status) {
        return claimRepository.findByStatus(status);
    }

    /**
     * Get claims by employee and status
     */
    public List<Claim> getClaimsByEmployeeAndStatus(Employee employee, String status) {
        return claimRepository.findByEmployeeAndStatus(employee, status);
    }

    /**
     * Get claims by employee ID and status
     */
    public List<Claim> getClaimsByEmployeeIdAndStatus(String employeeId, String status) {
        return claimRepository.findByEmployee_EmployeeIdAndStatus(employeeId, status);
    }
/**
 * Get all claims assigned to a specific HR
 */
public List<Claim> getClaimsByAssignedHr(Long hrId) {
    return claimRepository.findByAssignedHrId(hrId);
}

    /**
     * Get claim by ID
     */
    public Claim getClaimById(Long claimId) {
        return claimRepository.findById(claimId).orElse(null);
    }

    /**
     * Update an existing claim
     */
    public Claim updateClaim(Claim claim) throws Exception {
        if (claim.getAmount() > claim.getPolicy().getCoverageAmount()) {
            throw new Exception("Claim amount exceeds policy coverage!");
        }

        claim.setUpdatedAt(LocalDateTime.now());
        return claimRepository.save(claim);
    }
}
