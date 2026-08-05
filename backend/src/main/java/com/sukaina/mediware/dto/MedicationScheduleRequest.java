package com.sukaina.mediware.dto;

public class MedicationScheduleRequest {
    private String frequencyType;
    private String dailyType;
    private String timesPerDay;
    private String everyXHours;
    private String weekDays;
    private String nextDoseDate;
    private String monthInterval;
    private String asNeededNote;
    private String customScheduleNote;

    // Getters and Setters
    public String getFrequencyType() {
        return frequencyType;
    }   

    public void setFrequencyType(String frequencyType) {
        this.frequencyType = frequencyType;
    }

    public String getDailyType() {
        return dailyType;
    }

    public void setDailyType(String dailyType) {
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
