package com.insurai.insurai_backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai_backend.model.Agent;
import com.insurai.insurai_backend.model.AgentAvailability;
import com.insurai.insurai_backend.model.EmployeeQuery;
import com.insurai.insurai_backend.service.AgentAvailabilityService;
import com.insurai.insurai_backend.service.AgentService;
import com.insurai.insurai_backend.service.EmployeeQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/agent")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    private final AgentService agentService;
    private final AgentAvailabilityService availabilityService;
    private final EmployeeQueryService queryService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // -------------------- Get all agents --------------------
    @GetMapping
    public ResponseEntity<List<Agent>> getAllAgents() {
        try {
            return ResponseEntity.ok(agentService.getAllAgents());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // -------------------- Register a new agent --------------------
    @PostMapping("/register")
    public ResponseEntity<?> registerAgent(@RequestBody Agent agent) {
        try {
            agent.setPassword(passwordEncoder.encode(agent.getPassword()));
            Agent savedAgent = agentService.registerAgent(agent);
            return ResponseEntity.ok(savedAgent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error registering agent: " + e.getMessage());
        }
    }

    // -------------------- Agent login --------------------
    @PostMapping("/login")
    public ResponseEntity<?> loginAgent(@RequestBody Agent loginRequest) {
        try {
            Agent agent = agentService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Agent not found"));

            if (!passwordEncoder.matches(loginRequest.getPassword(), agent.getPassword())) {
                return ResponseEntity.status(401).body("Invalid password");
            }

            String token = java.util.UUID.randomUUID().toString();

            AgentLoginResponse response = new AgentLoginResponse(
                    "Login successful",
                    agent.getId(),
                    agent.getName(),
                    "agent",
                    token
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

    // -------------------- Save or schedule availability --------------------
    @PostMapping("/availability")
    public ResponseEntity<?> setAvailability(@RequestBody AvailabilityRequest request) {
        try {
            if (request.getAgentId() == null) {
                return ResponseEntity.badRequest().body("Agent ID is required");
            }

            AgentAvailability saved = availabilityService.setAvailability(
                    request.getAgentId(),
                    request.isAvailable(),
                    request.getStartTime(),
                    request.getEndTime()
            );

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving availability: " + e.getMessage());
        }
    }

    // -------------------- Get latest availability --------------------
    @GetMapping("/{id}/availability")
    public ResponseEntity<?> getAvailability(@PathVariable Long id) {
        return availabilityService.getAvailability(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------- Get all agents' latest availability --------------------
    @GetMapping("/availability/all")
    public ResponseEntity<?> getAllAgentsAvailability() {
        try {
            List<AgentAvailability> allAvailability = availabilityService.getAllLatestAvailability();
            return ResponseEntity.ok(allAvailability);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching agents availability: " + e.getMessage());
        }
    }

    // -------------------- Get only online agents --------------------
    @GetMapping("/available")
    public ResponseEntity<List<Agent>> getOnlineAgents() {
        try {
            List<Agent> onlineAgents = agentService.getAllAgents().stream()
                    .filter(agent -> availabilityService.getAvailability(agent.getId())
                            .map(AgentAvailability::isAvailable)
                            .orElse(false))
                    .toList();
            return ResponseEntity.ok(onlineAgents);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // -------------------- Get pending queries for a specific agent --------------------
    @GetMapping("/queries/pending/{agentId}")
    public ResponseEntity<?> getPendingQueriesForAgent(@PathVariable Long agentId) {
        List<EmployeeQuery> pendingQueries = queryService.getPendingQueriesForAgent(agentId);
        return ResponseEntity.ok(pendingQueries);
    }

    // -------------------- Respond to a query --------------------
   @PutMapping("/queries/respond/{queryId}")
public ResponseEntity<?> respondToQuery(@PathVariable Long queryId, @RequestBody RespondQueryRequest request) {
    try {
        EmployeeQuery query = queryService.getQueryById(queryId)
                .orElseThrow(() -> new RuntimeException("Query not found"));

        query.setResponse(request.getResponse());
        query.setStatus("Answered");
        query.setUpdatedAt(LocalDateTime.now());

        EmployeeQuery updatedQuery = queryService.saveQuery(query);
        return ResponseEntity.ok(updatedQuery);
    } catch (RuntimeException e) {
        return ResponseEntity.status(404).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error updating query: " + e.getMessage());
    }
}


    // -------------------- Inner class for Agent login response --------------------
    public static class AgentLoginResponse {
        private String message;
        private Long agentId;
        private String name;
        private String role;
        private String token;

        public AgentLoginResponse(String message, Long agentId, String name, String role, String token) {
            this.message = message;
            this.agentId = agentId;
            this.name = name;
            this.role = role;
            this.token = token;
        }

        public String getMessage() { return message; }
        public Long getAgentId() { return agentId; }
        public String getName() { return name; }
        public String getRole() { return role; }
        public String getToken() { return token; }
    }

    // -------------------- DTO for availability requests --------------------
    public static class AvailabilityRequest {
        private Long agentId;
        private boolean available;
        private LocalDateTime startTime;
        private LocalDateTime endTime;

        public Long getAgentId() { return agentId; }
        public void setAgentId(Long agentId) { this.agentId = agentId; }

        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }

        public LocalDateTime getStartTime() { return startTime; }
        public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

        public LocalDateTime getEndTime() { return endTime; }
        public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    }

    // -------------------- DTO for responding to a query --------------------
    public static class RespondQueryRequest {
        private String response;

        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
    }
}
