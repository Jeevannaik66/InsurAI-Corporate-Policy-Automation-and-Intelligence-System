package com.insurai.insurai_backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.insurai.insurai_backend.model.Employee;
import com.insurai.insurai_backend.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    /**
     * Registers a new employee.
     * Assumes password is already encoded and role is set in controller.
     */
    public Employee register(Employee employee) {
        return employeeRepository.save(employee);
    }

    /**
     * Validate employee credentials.
     */
    public boolean validateCredentials(Employee employee, String rawPassword, PasswordEncoder passwordEncoder) {
        return passwordEncoder.matches(rawPassword, employee.getPassword());
    }

    // -------------------- Generate simple token for Employee --------------------
    public String generateEmployeeToken(String identifier) {
        // identifier can be email or employeeId
        String tokenData = identifier + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(tokenData.getBytes(StandardCharsets.UTF_8));
    }

    // -------------------- Verify employee token --------------------
    public boolean isEmployee(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[EmployeeService] Authorization header missing or invalid");
            return false;
        }

        try {
            String token = authHeader.substring(7).trim(); // Remove "Bearer " prefix
            if (token.isEmpty()) {
                System.out.println("[EmployeeService] Token is empty");
                return false;
            }

            byte[] decodedBytes = Base64.getDecoder().decode(token);
            String decoded = new String(decodedBytes, StandardCharsets.UTF_8);

            String identifier = decoded.split(":")[0];

            // Try both email and employeeId lookup
            boolean exists = employeeRepository.findByEmail(identifier).isPresent()
                          || employeeRepository.findByEmployeeId(identifier).isPresent();

            if (!exists) {
                System.out.println("[EmployeeService] Token identifier not found in database");
            }

            return exists;
        } catch (IllegalArgumentException e) {
            System.out.println("[EmployeeService] Failed to decode token: " + e.getMessage());
            return false;
        }
    }
}
