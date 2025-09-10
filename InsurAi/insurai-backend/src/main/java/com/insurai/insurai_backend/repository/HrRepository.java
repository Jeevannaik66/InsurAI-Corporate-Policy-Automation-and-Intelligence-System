package com.insurai.insurai_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.insurai.insurai_backend.model.Hr;

public interface HrRepository extends JpaRepository<Hr, Long> {
    // Add this method
    Optional<Hr> findByEmail(String email);
}
