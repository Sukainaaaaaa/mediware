package com.sukaina.mediware.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sukaina.mediware.enums.DoseStatus;

public class DoseLogResponse {
    private Long id;
    private Long medicationId;
    private LocalDate doseDate;
    private Integer doseIndex;
    private LocalDateTime markedAt;
    private String medicationName;
    private String strength;
    private String strengthUnit;
    private String doseLabel;
    private DoseStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMedicationId() {
        return medicationId;
    }

    public void setMedicationId(Long medicationId) {
        this.medicationId = medicationId;
    }

    public LocalDate getDoseDate() {
        return doseDate;
    }

    public void setDoseDate(LocalDate doseDate) {
        this.doseDate = doseDate;
    }

    public Integer getDoseIndex() {
        return doseIndex;
    }

    public void setDoseIndex(Integer doseIndex) {
        this.doseIndex = doseIndex;
    }

    public LocalDateTime getMarkedAt() {
        return markedAt;
    }

    public void setMarkedAt(LocalDateTime markedAt) {
        this.markedAt = markedAt;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }

    public String getStrength() {
        return strength;
    }

    public void setStrength(String strength) {
        this.strength = strength;
    }

    public String getStrengthUnit() {
        return strengthUnit;
    }

    public void setStrengthUnit(String strengthUnit) {
        this.strengthUnit = strengthUnit;
    }

    public String getDoseLabel() {
        return doseLabel;
    }

    public void setDoseLabel(String doseLabel) {
        this.doseLabel = doseLabel;
    }

    public DoseStatus getStatus() {
        return status;
    }

    public void setStatus(DoseStatus status) {
        this.status = status;
    }


}
