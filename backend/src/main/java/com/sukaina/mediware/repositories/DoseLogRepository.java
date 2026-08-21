package com.sukaina.mediware.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sukaina.mediware.entities.DoseLog;
import com.sukaina.mediware.entities.User;
import com.sukaina.mediware.entities.Medication;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DoseLogRepository extends JpaRepository<DoseLog, Long> {
    List<DoseLog> findByUser(User user);

    void deleteByUser(User user);

    List<DoseLog> findByMedication(Medication medication);

    List<DoseLog> findByMedicationAndUser(Medication medication, User user);

    List<DoseLog> findByUserAndDoseDate(User user, LocalDate doseDate);

    List<DoseLog> findByMedicationAndDoseDate(Medication medication, LocalDate doseDate);

    Optional<DoseLog> findByMedicationAndUserAndDoseDateAndDoseIndex(
            Medication medication,
            User user,
            LocalDate doseDate,
            Integer doseIndex);

    List<DoseLog> findByUserAndDoseDateBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate);
}
