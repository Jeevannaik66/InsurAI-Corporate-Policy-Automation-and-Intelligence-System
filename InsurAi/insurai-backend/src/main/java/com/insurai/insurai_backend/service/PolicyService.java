package com.insurai.insurai_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.insurai.insurai_backend.model.Policy;
import com.insurai.insurai_backend.repository.PolicyRepository;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;

    @Autowired
    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    // Create a new policy
    public Policy createPolicy(Policy policy) {
        return policyRepository.save(policy);
    }

    // Get all policies
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    // Get policy by ID
    public Optional<Policy> getPolicyById(Long id) {
        return policyRepository.findById(id);
    }

    // Get active policies
    public List<Policy> getActivePolicies() {
        return policyRepository.findByPolicyStatus("Active");
    }

    // Update a policy
    public Policy updatePolicy(Long id, Policy updatedPolicy) {
        return policyRepository.findById(id).map(policy -> {
            policy.setPolicyName(updatedPolicy.getPolicyName());
            policy.setPolicyType(updatedPolicy.getPolicyType());
            policy.setProviderName(updatedPolicy.getProviderName());
            policy.setCoverageAmount(updatedPolicy.getCoverageAmount());
            policy.setMonthlyPremium(updatedPolicy.getMonthlyPremium());
            policy.setRenewalDate(updatedPolicy.getRenewalDate());
            policy.setPolicyStatus(updatedPolicy.getPolicyStatus());
            policy.setPolicyDescription(updatedPolicy.getPolicyDescription());
            return policyRepository.save(policy);
        }).orElseThrow(() -> new RuntimeException("Policy not found with id " + id));
    }

    // Delete a policy
    public void deletePolicy(Long id) {
        policyRepository.deleteById(id);
    }
}
