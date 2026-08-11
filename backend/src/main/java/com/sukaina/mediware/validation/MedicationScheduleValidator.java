package com.sukaina.mediware.validation;

import com.sukaina.mediware.dto.MedicationScheduleRequest;
import com.sukaina.mediware.enums.DailyType;
import com.sukaina.mediware.enums.FrequencyType;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class MedicationScheduleValidator implements ConstraintValidator<ValidMedicationSchedule, MedicationScheduleRequest> {

    @Override
    public boolean isValid(MedicationScheduleRequest request, ConstraintValidatorContext context) {
        if (request == null || request.getFrequencyType() == null) {
            return true;
        }

        return switch (request.getFrequencyType()) {
            case DAILY -> hasValidDailySchedule(request);
            case WEEKLY -> hasText(request.getWeekDays());
            case EVERY_TWO_WEEKS, ONCE_MONTHLY -> hasText(request.getNextDoseDate());
            case EVERY_FEW_MONTHS -> hasText(request.getMonthInterval()) && hasText(request.getNextDoseDate());
            case CUSTOM -> hasText(request.getCustomScheduleNote());
            case EVERY_OTHER_DAY, AS_NEEDED -> true;
        };
    }

    private boolean hasValidDailySchedule(MedicationScheduleRequest request) {
        if (request.getDailyType() == null) {
            return false;
        }

        if (request.getDailyType() == DailyType.TIMES_PER_DAY) {
            return hasText(request.getTimesPerDay());
        }

        if (request.getDailyType() == DailyType.EVERY_X_HOURS) {
            return hasText(request.getEveryXHours());
        }

        return false;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
