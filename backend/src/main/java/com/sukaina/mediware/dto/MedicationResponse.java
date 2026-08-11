package com.sukaina.mediware.dto;

public class MedicationResponse {
    private Long id;
    private String name;
    private String form;
    private String strength;
    private String strengthUnit;
    private String indication;
    private String trackingStartDate;
    private String createdAt;
    private String updatedAt;
    private boolean active;
    private MedicationScheduleResponse schedule;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public MedicationScheduleResponse getSchedule() {
        return schedule;
    }

    public void setSchedule(MedicationScheduleResponse schedule) {
        this.schedule = schedule;
    }
}
