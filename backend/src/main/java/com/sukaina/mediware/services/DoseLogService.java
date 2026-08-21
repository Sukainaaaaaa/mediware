package com.sukaina.mediware.services;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import com.sukaina.mediware.dto.CreateDoseLogRequest;
import com.sukaina.mediware.dto.DoseLogResponse;
import com.sukaina.mediware.entities.DoseLog;
import com.sukaina.mediware.entities.Medication;
import com.sukaina.mediware.entities.User;
import com.sukaina.mediware.enums.DoseStatus;
import com.sukaina.mediware.repositories.DoseLogRepository;
import com.sukaina.mediware.repositories.MedicationRepository;

@Service
public class DoseLogService {

    private final DoseLogRepository doseLogRepository;
    private final MedicationRepository medicationRepository;

    public DoseLogService(
            DoseLogRepository doseLogRepository,
            MedicationRepository medicationRepository) {
        this.doseLogRepository = doseLogRepository;
        this.medicationRepository = medicationRepository;
    }

    public DoseLogResponse logDose(CreateDoseLogRequest request, User user) {
        Medication medication = medicationRepository
                .findByIdAndUser(request.getMedicationId(), user)
                .orElse(null);

        if (medication == null) {
            return null;
        }

        DoseLog doseLog = doseLogRepository
                .findByMedicationAndUserAndDoseDateAndDoseIndex(
                        medication,
                        user,
                        request.getDoseDate(),
                        request.getDoseIndex())
                .orElseGet(DoseLog::new);

        doseLog.setMedication(medication);
        doseLog.setUser(user);
        doseLog.setDoseDate(request.getDoseDate());
        doseLog.setDoseIndex(request.getDoseIndex());
        doseLog.setMarkedAt(LocalDateTime.now());
        doseLog.setMedicationName(medication.getName());
        doseLog.setStrength(medication.getStrength());
        doseLog.setStrengthUnit(medication.getStrengthUnit());
        doseLog.setDoseLabel("Dose " + request.getDoseIndex());
        doseLog.setStatus(DoseStatus.TAKEN);

        return toDoseLogResponse(doseLogRepository.save(doseLog));
    }

    public List<DoseLogResponse> getDoseLogsForUser(User user) {
        return doseLogRepository.findByUser(user)
                .stream()
                .map(this::toDoseLogResponse)
                .toList();
    }

    public boolean deleteDoseLog(Long medicationId, LocalDate doseDate, Integer doseIndex, User user) {
        Medication medication = medicationRepository
                .findByIdAndUser(medicationId, user)
                .orElse(null);

        if (medication == null) {
            return false;
        }

        DoseLog doseLog = doseLogRepository
                .findByMedicationAndUserAndDoseDateAndDoseIndex(
                        medication,
                        user,
                        doseDate,
                        doseIndex)
                .orElse(null);

        if (doseLog == null) {
            return false;
        }

        doseLogRepository.delete(doseLog);
        return true;
    }

    private DoseLogResponse toDoseLogResponse(DoseLog doseLog) {
        DoseLogResponse response = new DoseLogResponse();

        response.setId(doseLog.getId());
        response.setMedicationId(doseLog.getMedication().getId());
        response.setDoseDate(doseLog.getDoseDate());
        response.setDoseIndex(doseLog.getDoseIndex());
        response.setMarkedAt(doseLog.getMarkedAt());
        response.setMedicationName(doseLog.getMedicationName());
        response.setStrength(doseLog.getStrength());
        response.setStrengthUnit(doseLog.getStrengthUnit());
        response.setDoseLabel(doseLog.getDoseLabel());
        response.setStatus(doseLog.getStatus());

        return response;
    }

}
