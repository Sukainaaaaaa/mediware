package com.sukaina.mediware.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sukaina.mediware.entities.Medication;

public interface MedicationRepository extends JpaRepository<Medication, Long> {

}
