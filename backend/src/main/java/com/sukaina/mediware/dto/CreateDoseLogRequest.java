package com.sukaina.mediware.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class CreateDoseLogRequest {
    @NotNull(message = "Medication ID cannot be null")
    private Long medicationId;

    @NotNull(message = "Dose date cannot be null")
    private LocalDate doseDate;

    @NotNull(message = "Dose index cannot be null")
    @Min(value = 1, message = "Dose index must be a positive integer")
    private Integer doseIndex;

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
}
