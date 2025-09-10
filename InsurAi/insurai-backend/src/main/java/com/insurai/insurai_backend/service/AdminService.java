package com.insurai.insurai_backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.insurai.insurai_backend.model.Agent;
import com.insurai.insurai_backend.model.Hr;
import com.insurai.insurai_backend.model.RegisterRequest;
import com.insurai.insurai_backend.repository.AgentRepository;
import com.insurai.insurai_backend.repository.HrRepository;

@Service
public class AdminService {

    private static final String ADMIN_EMAIL = "admin@insurai.com";
    private static final String ADMIN_PASSWORD = "Admin@123";

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private HrRepository hrRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // -------------------- Admin login --------------------
    public boolean validateAdmin(String email, String password) {
        return ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password);
    }

    public String getAdminName(String email) {
        return ADMIN_EMAIL.equals(email) ? "Admin" : null;
    }

    public String getAdminRole() {
        return "ADMIN";
    }

    // -------------------- Generate simple token --------------------
    public String generateAdminToken(String email) {
        String tokenData = email + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(tokenData.getBytes(StandardCharsets.UTF_8));
    }

    // -------------------- Verify admin token --------------------
    public boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[AdminService] Authorization header missing or invalid");
            return false;
        }

        try {
            String token = authHeader.substring(7).trim(); // Remove "Bearer " prefix
            if (token.isEmpty()) {
                System.out.println("[AdminService] Token is empty");
                return false;
            }

            byte[] decodedBytes = Base64.getDecoder().decode(token);
            String decoded = new String(decodedBytes, StandardCharsets.UTF_8);

            boolean isAdmin = decoded.startsWith(ADMIN_EMAIL + ":");
            if (!isAdmin) {
                System.out.println("[AdminService] Token does not match admin email");
            }

            return isAdmin;
        } catch (IllegalArgumentException e) {
            System.out.println("[AdminService] Failed to decode token: " + e.getMessage());
            return false;
        }
    }

    // -------------------- Register Agent --------------------
    public void registerAgent(RegisterRequest request) {
        Agent agent = new Agent();
        agent.setName(request.getName());
        agent.setEmail(request.getEmail());
        agent.setPassword(passwordEncoder.encode(request.getPassword()));
        agentRepository.save(agent);
    }

    // -------------------- Register HR --------------------
    public void registerHR(RegisterRequest request) {
        Hr hr = new Hr();
        hr.setName(request.getName());
        hr.setEmail(request.getEmail());
        hr.setPhoneNumber(request.getPhoneNumber());
        hr.setHrId(request.getHrId());
        hr.setPassword(passwordEncoder.encode(request.getPassword()));
        hrRepository.save(hr);
    }
}
