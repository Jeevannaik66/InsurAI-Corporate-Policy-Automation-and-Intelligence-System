package com.insurai.insurai_backend.controller;

import java.util.List;
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
import com.insurai.insurai_backend.model.Hr;
import com.insurai.insurai_backend.model.LoginRequest;
import com.insurai.insurai_backend.repository.HrRepository;
import com.insurai.insurai_backend.service.HrService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/hr")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class HrController {

    private final HrService hrService;
    private final HrRepository hrRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ================= HR Login =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Hr hr = hrRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("HR not found"));

        if (!passwordEncoder.matches(request.getPassword(), hr.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(hr.getEmail(), "HR");

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", "hr",
                "name", hr.getName()
        ));
    }

    // ================= Get All HRs =================
    @GetMapping
    public ResponseEntity<List<Hr>> getAllHRs() {
        List<Hr> hrs = hrRepository.findAll();
        return ResponseEntity.ok(hrs);
    }
}
