package com.insurai.insurai_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.insurai.insurai_backend.model.Agent;
import com.insurai.insurai_backend.model.Employee;
import com.insurai.insurai_backend.model.EmployeeQuery;
import com.insurai.insurai_backend.repository.AgentRepository;
import com.insurai.insurai_backend.repository.EmployeeQueryRepository;
import com.insurai.insurai_backend.repository.EmployeeRepository;

@Service
public class EmployeeQueryService {

    @Autowired
    private EmployeeQueryRepository queryRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AgentRepository agentRepository;

    // -------------------- Submit a new query --------------------
    public EmployeeQuery submitQuery(Long employeeId, Long agentId, String queryText) throws Exception {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new Exception("Employee not found"));

        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new Exception("Agent not found"));

        if (!agent.isAvailable()) {
            throw new Exception("Selected agent is not available");
        }

        EmployeeQuery query = new EmployeeQuery();
        query.setEmployee(employee);
        query.setAgent(agent);
        query.setQueryText(queryText);
        query.setStatus("pending");

        return queryRepository.save(query);
    }

    // -------------------- Respond to a query (requires agentId) --------------------
    public EmployeeQuery respondToQuery(Long agentId, Long queryId, String response) throws Exception {
        EmployeeQuery query = queryRepository.findById(queryId)
                .orElseThrow(() -> new Exception("Query not found"));

        if (!query.getAgent().getId().equals(agentId)) {
            throw new Exception("Unauthorized: You are not assigned to this query");
        }

        query.setResponse(response);
        query.setStatus("Resolved"); // consistent with frontend
        query.setUpdatedAt(java.time.LocalDateTime.now()); // update timestamp
        return queryRepository.save(query);
    }

    // -------------------- Respond to a query without agentId --------------------
    public EmployeeQuery respondToQuery(EmployeeQuery query, String response) throws Exception {
        if (query == null) throw new Exception("Query cannot be null");
        query.setResponse(response);
        query.setStatus("Resolved");
        query.setUpdatedAt(java.time.LocalDateTime.now()); // update timestamp
        return queryRepository.save(query);
    }

    // -------------------- Fetch queries --------------------
    public List<EmployeeQuery> getAllQueries() {
        return queryRepository.findAll();
    }

    public List<EmployeeQuery> getQueriesForAgent(Long agentId) {
        return queryRepository.findByAgentId(agentId);
    }

    public List<EmployeeQuery> getQueriesForEmployee(Long employeeId) {
        return queryRepository.findByEmployeeId(employeeId);
    }

    public List<EmployeeQuery> getPendingQueriesForAgent(Long agentId) {
        return queryRepository.findByAgentIdAndStatus(agentId, "pending");
    }

    public List<EmployeeQuery> getAllPendingQueries() {
        return queryRepository.findByStatus("pending");
    }
 public List<EmployeeQuery> getAllQueriesForAgent(Long agentId) {
    return queryRepository.findByAgentId(agentId);
}




    // -------------------- New methods to match controller --------------------
    public Optional<EmployeeQuery> findById(Long queryId) {
        return queryRepository.findById(queryId);
    }

    public EmployeeQuery save(EmployeeQuery query) {
        return queryRepository.save(query);
    }
}
