package com.insurai.insurai_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.insurai.insurai_backend.model.Policy;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    // Optional: Find all active policies
    List<Policy> findByPolicyStatus(String policyStatus);

    // Optional: Find policies by type
    List<Policy> findByPolicyType(String policyType);

    // Optional: Find policies by provider
    List<Policy> findByProviderName(String providerName);
}
