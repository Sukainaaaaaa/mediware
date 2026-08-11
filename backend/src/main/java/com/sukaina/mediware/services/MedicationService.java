package com.sukaina.mediware.services;

import com.sukaina.mediware.entities.MedicationSchedule;
import org.springframework.stereotype.Service;
import java.util.*;
import com.sukaina.mediware.entities.Medication;
import com.sukaina.mediware.repositories.MedicationRepository;
import com.sukaina.mediware.dto.CreateMedicationRequest;
import com.sukaina.mediware.dto.MedicationResponse;
import com.sukaina.mediware.dto.MedicationScheduleResponse;
import com.sukaina.mediware.entities.User;
import java.time.LocalDate;

@Service
public class MedicationService {
    private final MedicationRepository medicationRepository;

    public MedicationService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    public List<MedicationResponse> getAllMedicationsForUser(User user) {
        return medicationRepository.findByUser(user)
                .stream()
                .map(this::toMedicationResponse)
                .toList();
    }

    public MedicationResponse createMedication(CreateMedicationRequest request, User user) {
        Medication medication = new Medication();
        medication.setUser(user);
        medication.setTracking_start_date(LocalDate.now().toString());

        MedicationSchedule medicationSchedule = new MedicationSchedule();
        medication.setMedicationSchedule(medicationSchedule);
        medicationSchedule.setMedication(medication);

        applyMedicationRequest(medication, request);

        return toMedicationResponse(medicationRepository.save(medication));
    }

    public MedicationResponse updateMedication(Long id, CreateMedicationRequest request, User user) {
        Medication medication = medicationRepository.findByIdAndUser(id, user).orElse(null);

        if (medication == null) {
            return null;
        }

        if (medication.getMedicationSchedule() == null) {
            MedicationSchedule medicationSchedule = new MedicationSchedule();
            medication.setMedicationSchedule(medicationSchedule);
            medicationSchedule.setMedication(medication);
        }

        applyMedicationRequest(medication, request);

        return toMedicationResponse(medicationRepository.save(medication));
    }

    public MedicationResponse getMedicationById(Long id, User user) {
        Medication medication = medicationRepository.findByIdAndUser(id, user).orElse(null);

        if (medication == null) {
            return null;
        }

        return toMedicationResponse(medication);
    }

    public boolean deleteMedication(Long id, User user) {
        Medication medication = medicationRepository.findByIdAndUser(id, user).orElse(null);

        if (medication != null) {
            medicationRepository.delete(medication);
            return true;
        }

        return false;
    }

    private void applyMedicationRequest(Medication medication, CreateMedicationRequest request) {
        MedicationSchedule medicationSchedule = medication.getMedicationSchedule();

        medication.setName(request.getName());
        medication.setForm(request.getForm());
        medication.setStrength(request.getStrength());
        medication.setStrengthUnit(request.getStrengthUnit());
        medication.setIndication(request.getIndication());

        if (request.getSchedule() == null) {
            return;
        }

        medicationSchedule.setFrequency_type(request.getSchedule().getFrequencyType());
        medicationSchedule.setTimes_per_day(request.getSchedule().getTimesPerDay());
        medicationSchedule.setDaily_type(request.getSchedule().getDailyType());
        medicationSchedule.setEvery_x_hours(request.getSchedule().getEveryXHours());
        medicationSchedule.setWeek_days(request.getSchedule().getWeekDays());
        medicationSchedule.setNext_dose_date(request.getSchedule().getNextDoseDate());
        medicationSchedule.setMonth_interval(request.getSchedule().getMonthInterval());
        medicationSchedule.setAs_needed_note(request.getSchedule().getAsNeededNote());
        medicationSchedule.setCustom_schedule_note(request.getSchedule().getCustomScheduleNote());
    }

    private MedicationResponse toMedicationResponse(Medication medication) {
        MedicationResponse response = new MedicationResponse();

        response.setId(medication.getId());
        response.setName(medication.getName());
        response.setForm(medication.getForm());
        response.setStrength(medication.getStrength());
        response.setStrengthUnit(medication.getStrengthUnit());
        response.setIndication(medication.getIndication());
        response.setTrackingStartDate(medication.getTracking_start_date());
        response.setCreatedAt(medication.getCreated_at());
        response.setUpdatedAt(medication.getUpdated_at());
        response.setActive(medication.isActive());
        response.setSchedule(toMedicationScheduleResponse(medication.getMedicationSchedule()));

        return response;
    }

    private MedicationScheduleResponse toMedicationScheduleResponse(MedicationSchedule medicationSchedule) {
        if (medicationSchedule == null) {
            return null;
        }

        MedicationScheduleResponse response = new MedicationScheduleResponse();

        response.setId(medicationSchedule.getId());
        response.setFrequencyType(medicationSchedule.getFrequency_type());
        response.setDailyType(medicationSchedule.getDaily_type());
        response.setTimesPerDay(medicationSchedule.getTimes_per_day());
        response.setEveryXHours(medicationSchedule.getEvery_x_hours());
        response.setWeekDays(medicationSchedule.getWeek_days());
        response.setNextDoseDate(medicationSchedule.getNext_dose_date());
        response.setMonthInterval(medicationSchedule.getMonth_interval());
        response.setAsNeededNote(medicationSchedule.getAs_needed_note());
        response.setCustomScheduleNote(medicationSchedule.getCustom_schedule_note());

        return response;
    }

}
