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
    private final AgentJwtAuthenticationFilter agentJwtAuthenticationFilter;

    public SecurityConfig(EmployeeJwtAuthenticationFilter employeeJwtAuthenticationFilter,
                          AgentJwtAuthenticationFilter agentJwtAuthenticationFilter) {
        this.employeeJwtAuthenticationFilter = employeeJwtAuthenticationFilter;
        this.agentJwtAuthenticationFilter = agentJwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .authorizeHttpRequests(auth -> auth
                // Public endpoints for everything except respond
                .requestMatchers(
                    "/auth/**",
                    "/admin/**",
                    "/admin/policies",
                    "/admin/policies/save",
                    "/agent/**",
                    "/employee/login",
                    "/employee/register",
                    "/employee/policies",
                    "/hr/login",
                    "/agent/availability/**",
                    "/agent/queries/pending/**",
                    "/employees/**",
                    "/employee/queries",
                    "/hr/**"
                ).permitAll()
                // Only /agent/queries/respond/** requires ROLE_AGENT
                .requestMatchers("/agent/queries/respond/**","/agent/queries/all/**").hasRole("AGENT")
                // Employee endpoints require ROLE_EMPLOYEE
                .requestMatchers("/employee/**").hasRole("EMPLOYEE")
                // Everything else authenticated
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(formLogin -> formLogin.disable());

        // Add JWT filters
        http.addFilterBefore(employeeJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(agentJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Global CORS configuration
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:8080")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
