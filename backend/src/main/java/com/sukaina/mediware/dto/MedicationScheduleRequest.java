package com.sukaina.mediware.dto;

import com.sukaina.mediware.enums.DailyType;
import com.sukaina.mediware.enums.FrequencyType;
import com.sukaina.mediware.validation.ValidMedicationSchedule;

import jakarta.validation.constraints.NotNull;

@ValidMedicationSchedule
public class MedicationScheduleRequest {
    @NotNull(message = "Medication frequency is required")
    private FrequencyType frequencyType;

    private DailyType dailyType;
    private String timesPerDay;
    private String everyXHours;
    private String weekDays;
    private String nextDoseDate;
    private String monthInterval;
    private String asNeededNote;
    private String customScheduleNote;

    // Getters and Setters
    public FrequencyType getFrequencyType() {
        return frequencyType;
    }   

    public void setFrequencyType(FrequencyType frequencyType) {
        this.frequencyType = frequencyType;
    }

    public DailyType getDailyType() {
        return dailyType;
    }

    public void setDailyType(DailyType dailyType) {
        this.dailyType = dailyType;
    }

    public String getTimesPerDay() {
        return timesPerDay;
    }

    public void setTimesPerDay(String timesPerDay) {
        this.timesPerDay = timesPerDay;
    }

    public String getEveryXHours() {
        return everyXHours;
    }   

    public void setEveryXHours(String everyXHours) {
        this.everyXHours = everyXHours;
    }

    public String getWeekDays() {
        return weekDays;
    }

    public void setWeekDays(String weekDays) {
        this.weekDays = weekDays;
    }

    public String getNextDoseDate() {
        return nextDoseDate;
    }

    public void setNextDoseDate(String nextDoseDate) {
        this.nextDoseDate = nextDoseDate;
    }

    public String getMonthInterval() {
        return monthInterval;
    }

    public void setMonthInterval(String monthInterval) {
        this.monthInterval = monthInterval;
    }

    public String getAsNeededNote() {
        return asNeededNote;
    }

    public void setAsNeededNote(String asNeededNote) {
        this.asNeededNote = asNeededNote;
    }

    public String getCustomScheduleNote() {
        return customScheduleNote;
    }

    public void setCustomScheduleNote(String customScheduleNote) {
        this.customScheduleNote = customScheduleNote;
    }

    
}
