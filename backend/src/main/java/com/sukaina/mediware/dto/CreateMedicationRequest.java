package com.sukaina.mediware.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateMedicationRequest {

    @NotBlank(message = "Medication name is required")
    private String name;

    @NotBlank(message = "Medication form is required")
    private String form;
    @NotBlank(message = "Medication strength is required")
    private String strength;
    @NotBlank(message = "Medication strength unit is required")
    private String strengthUnit;

    private String indication;
    
    @Valid
    @NotNull(message = "Medication schedule is required")
    private MedicationScheduleRequest schedule;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getForm() {
        return form;
    }

    public void setForm(String form) {
        this.form = form;
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

    public String getIndication() {
        return indication;
    }


    public void setIndication(String indication) {
        this.indication = indication;
    }

    public MedicationScheduleRequest getSchedule() {
        return schedule;
    }

    public void setSchedule(MedicationScheduleRequest schedule) {
        this.schedule = schedule;
    }
}
