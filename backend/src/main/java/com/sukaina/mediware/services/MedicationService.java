package com.sukaina.mediware.services;

import com.sukaina.mediware.entities.MedicationSchedule;
import org.springframework.stereotype.Service;
import java.util.*;
import com.sukaina.mediware.entities.Medication;
import com.sukaina.mediware.repositories.MedicationRepository;
import com.sukaina.mediware.dto.CreateMedicationRequest;

@Service
public class MedicationService {
    private final MedicationRepository medicationRepository;

    public MedicationService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    public Medication createMedication(CreateMedicationRequest request) {
        Medication medication = new Medication();
        MedicationSchedule medicationSchedule = new MedicationSchedule();
        medication.setName(request.getName());
        medication.setForm(request.getForm());
        medication.setStrength(request.getStrength());
        medication.setStrengthUnit(request.getStrengthUnit());
        medication.setIndication(request.getIndication());
        medication.setTracking_start_date(request.getTrackingStartDate());
        medicationSchedule.setFrequency_type(request.getSchedule().getFrequencyType());
        medicationSchedule.setTimes_per_day(request.getSchedule().getTimesPerDay());
        medicationSchedule.setDaily_type(request.getSchedule().getDailyType());
        medicationSchedule.setEvery_x_hours(request.getSchedule().getEveryXHours());
        medicationSchedule.setWeek_days(request.getSchedule().getWeekDays());
        medicationSchedule.setNext_dose_date(request.getSchedule().getNextDoseDate());
        medicationSchedule.setMonth_interval(request.getSchedule().getMonthInterval());
        medicationSchedule.setAs_needed_note(request.getSchedule().getAsNeededNote());
        medicationSchedule.setCustom_schedule_note(request.getSchedule().getCustomScheduleNote());

        medication.setMedicationSchedule(medicationSchedule);
        medicationSchedule.setMedication(medication);

        return medicationRepository.save(medication);
    }

    public Medication getMedicationById(Long id) {
        return medicationRepository.findById(id).orElse(null);
    }

    public void deleteMedication(Long id) {
        medicationRepository.deleteById(id);
    }

}
