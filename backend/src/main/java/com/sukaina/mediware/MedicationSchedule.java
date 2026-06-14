package com.sukaina.mediware;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class MedicationSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long medicationId;
    private String frequency_type;
    private String daily_type;
    private String times_per_day;
    private String every_x_hours;
    private String week_days;
    private String next_dose_date;
    private String month_interval;
    private String as_needed_note;
    private String custom_schedule_note;

    // Getters and Setters
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

    public String getFrequency_type() {
        return frequency_type;
    }

    public void setFrequency_type(String frequency_type) {
        this.frequency_type = frequency_type;
    }

    public String getDaily_type() {
        return daily_type;
    }

    public void setDaily_type(String daily_type) {
        this.daily_type = daily_type;
    }

    public String getTimes_per_day() {
        return times_per_day;
    }

    public void setTimes_per_day(String times_per_day) {
        this.times_per_day = times_per_day;
    }

    public String getEvery_x_hours() {
        return every_x_hours;
    }

    public void setEvery_x_hours(String every_x_hours) {
        this.every_x_hours = every_x_hours;
    }

    public String getWeek_days() {
        return week_days;
    }

    public void setWeek_days(String week_days) {
        this.week_days = week_days;
    }

    public String getNext_dose_date() {
        return next_dose_date;
    }

    public void setNext_dose_date(String next_dose_date) {
        this.next_dose_date = next_dose_date;
    }

    public String getMonth_interval() {
        return month_interval;
    }

    public void setMonth_interval(String month_interval) {
        this.month_interval = month_interval;
    }

    public String getAs_needed_note() {
        return as_needed_note;
    }

    public void setAs_needed_note(String as_needed_note) {
        this.as_needed_note = as_needed_note;
    }

    public String getCustom_schedule_note() {
        return custom_schedule_note;
    }

    public void setCustom_schedule_note(String custom_schedule_note) {
        this.custom_schedule_note = custom_schedule_note;
    }

}
