package com.insurai.insurai_backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurai.insurai_backend.config.JwtUtil;
import com.insurai.insurai_backend.model.Employee;
import com.insurai.insurai_backend.model.LoginRequest;
import com.insurai.insurai_backend.model.RegisterRequest;
import com.insurai.insurai_backend.repository.EmployeeRepository;
import com.insurai.insurai_backend.service.EmployeeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // enable CORS for frontend
public class AuthController {

    private final EmployeeService employeeService;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil; // <-- Inject JwtUtil for proper JWT

    // ================= Employee Registration =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Check if email already exists
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Create new Employee
        Employee emp = new Employee();
        emp.setName(request.getName());
        emp.setEmail(request.getEmail());
        emp.setPassword(passwordEncoder.encode(request.getPassword())); // encode password
        emp.setRole(Employee.Role.EMPLOYEE); // default role

        // Save employee
        employeeService.register(emp);

        return ResponseEntity.ok("Employee registered successfully");
    }

    // ================= Employee Login =================
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // Check if employee exists
    var empOptional = employeeRepository.findByEmail(request.getEmail());
    if (empOptional.isEmpty()) {
        return ResponseEntity.status(404).body("User not found"); // <-- return 404 instead of exception
    }

    Employee emp = empOptional.get();

    // Check password
    if (!passwordEncoder.matches(request.getPassword(), emp.getPassword())) {
        return ResponseEntity.status(401).body("Incorrect password"); // <-- 401 for wrong password
    }

    // Generate JWT
    String token = jwtUtil.generateToken(emp.getEmail(), emp.getRole().name());

    // Return token, role, and name
    return ResponseEntity.ok(Map.of(
            "token", token,
            "role", emp.getRole().name(),
            "name", emp.getName()
    ));
}


    // ================= Get All Employees =================
    @GetMapping("/employees")
    public ResponseEntity<?> getAllEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }
}
