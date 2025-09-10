package com.insurai.insurai_backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String policyName;

    @Column(nullable = false)
    private String policyType; // Health, Life, Accident, Corporate Benefit, etc.

    @Column(nullable = false)
    private String providerName;

    @Column(nullable = false)
    private Double coverageAmount;

    @Column(nullable = false)
    private Double monthlyPremium;

    @Column(nullable = false)
    private LocalDate renewalDate;

    @Column(nullable = false)
    private String policyStatus = "Active"; // Default Active

    @Column(columnDefinition = "TEXT")
    private String policyDescription;

    // Constructors
    public Policy() {}

    public Policy(String policyName, String policyType, String providerName,
                  Double coverageAmount, Double monthlyPremium, LocalDate renewalDate,
                  String policyStatus, String policyDescription) {
        this.policyName = policyName;
        this.policyType = policyType;
        this.providerName = providerName;
        this.coverageAmount = coverageAmount;
        this.monthlyPremium = monthlyPremium;
        this.renewalDate = renewalDate;
        this.policyStatus = policyStatus;
        this.policyDescription = policyDescription;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPolicyName() {
        return policyName;
    }

    public void setPolicyName(String policyName) {
        this.policyName = policyName;
    }

    public String getPolicyType() {
        return policyType;
    }

    public void setPolicyType(String policyType) {
        this.policyType = policyType;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public Double getCoverageAmount() {
        return coverageAmount;
    }

    public void setCoverageAmount(Double coverageAmount) {
        this.coverageAmount = coverageAmount;
    }

    public Double getMonthlyPremium() {
        return monthlyPremium;
    }

    public void setMonthlyPremium(Double monthlyPremium) {
        this.monthlyPremium = monthlyPremium;
    }

    public LocalDate getRenewalDate() {
        return renewalDate;
    }

    public void setRenewalDate(LocalDate renewalDate) {
        this.renewalDate = renewalDate;
    }

    public String getPolicyStatus() {
        return policyStatus;
    }

    public void setPolicyStatus(String policyStatus) {
        this.policyStatus = policyStatus;
    }

    public String getPolicyDescription() {
        return policyDescription;
    }

    public void setPolicyDescription(String policyDescription) {
        this.policyDescription = policyDescription;
    }

    @Override
    public String toString() {
        return "Policy{" +
                "id=" + id +
                ", policyName='" + policyName + '\'' +
                ", policyType='" + policyType + '\'' +
                ", providerName='" + providerName + '\'' +
                ", coverageAmount=" + coverageAmount +
                ", monthlyPremium=" + monthlyPremium +
                ", renewalDate=" + renewalDate +
                ", policyStatus='" + policyStatus + '\'' +
                ", policyDescription='" + policyDescription + '\'' +
                '}';
    }
}
