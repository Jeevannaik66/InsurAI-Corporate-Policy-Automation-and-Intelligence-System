package com.insurai.insurai_backend.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.insurai.insurai_backend.model.Agent;
import com.insurai.insurai_backend.model.AgentAvailability;
import com.insurai.insurai_backend.model.Employee;
import com.insurai.insurai_backend.model.EmployeeQuery;
import com.insurai.insurai_backend.repository.AgentAvailabilityRepository;
import com.insurai.insurai_backend.repository.AgentRepository;
import com.insurai.insurai_backend.repository.EmployeeRepository;
import com.insurai.insurai_backend.service.EmployeeQueryService;

@RestController
@RequestMapping("/employee")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeQueryController {

    @Autowired
    private EmployeeQueryService queryService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private AgentAvailabilityRepository agentAvailabilityRepository;

    // ================= Employee Submits a Query =================
    @PostMapping("/queries")
    public ResponseEntity<?> submitQuery(
            @RequestParam Long agentId,
            @RequestParam String queryText
    ) {
        try {
            // For testing, using employee with ID 1
            Employee emp = employeeRepository.findById(1L).orElse(null);
            if (emp == null) {
                return ResponseEntity.badRequest().body("Employee not found");
            }

            Agent agent = agentRepository.findById(agentId).orElse(null);
            if (agent == null) {
                return ResponseEntity.badRequest().body("Invalid agent ID");
            }

            // Check agent availability
            Optional<AgentAvailability> latestAvailabilityOpt =
                    agentAvailabilityRepository.findTopByAgentOrderByIdDesc(agent);

            boolean isOnline = latestAvailabilityOpt
                    .map(a -> a.isAvailable() && (a.getEndTime() == null || a.getEndTime().isAfter(LocalDateTime.now())))
                    .orElse(false);

            agent.setAvailable(isOnline);

            if (!isOnline) {
                return ResponseEntity.badRequest().body("Selected agent is not available");
            }

            EmployeeQuery query = queryService.submitQuery(emp.getId(), agentId, queryText);
            return ResponseEntity.ok(query);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ================= Agent Responds to Query =================
    @PutMapping("/queries/respond/{queryId}")
    public ResponseEntity<?> respondToQuery(
            @PathVariable Long queryId,
            @RequestBody RespondQueryRequest request
    ) {
        try {
            if (request.getAgentId() == null) {
                return ResponseEntity.badRequest().body("Agent ID is required");
            }

            EmployeeQuery query = queryService.getQueryById(queryId)
                    .orElseThrow(() -> new RuntimeException("Query not found"));

            // Validate agent assignment
            if (!query.getAgent().getId().equals(request.getAgentId())) {
                return ResponseEntity.status(403).body("Unauthorized: You are not assigned to this query");
            }

            query.setResponse(request.getResponse());
            query.setStatus("Resolved");
            query.setUpdatedAt(LocalDateTime.now());

            EmployeeQuery updatedQuery = queryService.saveQuery(query);
            return ResponseEntity.ok(updatedQuery);

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating query: " + e.getMessage());
        }
    }

    // ================= DTO for responding to a query =================
    public static class RespondQueryRequest {
        private Long agentId;
        private String response;

        public Long getAgentId() { return agentId; }
        public void setAgentId(Long agentId) { this.agentId = agentId; }

        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
    }
}
