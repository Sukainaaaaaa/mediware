package com.sukaina.mediware.validation;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target(TYPE)
@Retention(RUNTIME)
@Constraint(validatedBy = MedicationScheduleValidator.class)
public @interface ValidMedicationSchedule {
    String message() default "Medication schedule is incomplete";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
