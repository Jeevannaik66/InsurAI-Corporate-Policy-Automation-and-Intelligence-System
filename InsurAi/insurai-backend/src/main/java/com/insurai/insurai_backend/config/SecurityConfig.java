package com.insurai.insurai_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig {

    private final EmployeeJwtAuthenticationFilter employeeJwtAuthenticationFilter;

    public SecurityConfig(EmployeeJwtAuthenticationFilter employeeJwtAuthenticationFilter) {
        this.employeeJwtAuthenticationFilter = employeeJwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
            .cors(cors -> {}) // Enable CORS, configured below
            .authorizeHttpRequests(auth -> auth
    // Public endpoints
    .requestMatchers(
        "/auth/**",
        "/admin/**",
        "/admin/policies",
        "/agent/**",
        "/employee/login",
        "/employee/register",
        "/hr/login",
        "/agent/availability/**",
        "/agent/queries/pending/**",   // <-- newly added endpoint
       "/agent/queries/respond/**",
        "/employees/**",
        "/hr/**"
    ).permitAll()
    // Employee endpoints require ROLE_EMPLOYEE
    .requestMatchers("/employee/**").hasRole("EMPLOYEE")
    // Everything else authenticated
    .anyRequest().authenticated()
)

            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(formLogin -> formLogin.disable());

        // -----------------------------
        // Add Employee JWT filter ONLY for /employee/** endpoints
        // -----------------------------
        http.addFilterBefore(employeeJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // -----------------------------
    // Global CORS configuration
    // -----------------------------
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
