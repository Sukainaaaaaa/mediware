package com.sukaina.mediware.dto;

import com.sukaina.mediware.dto.MedicationScheduleRequest;

public class CreateMedicationRequest {
    private String name;
    private String form;
    private String strength;
    private String strengthUnit;
    private String indication;
    private String trackingStartDate;
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


    public String getTrackingStartDate() {
        return trackingStartDate;
    }

    public void setTrackingStartDate(String trackingStartDate) {
        this.trackingStartDate = trackingStartDate;
    }

    public MedicationScheduleRequest getSchedule() {
        return schedule;
    }

    public void setSchedule(MedicationScheduleRequest schedule) {
        this.schedule = schedule;
    }
}
