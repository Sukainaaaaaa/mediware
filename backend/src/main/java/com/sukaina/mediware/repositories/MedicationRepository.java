package com.sukaina.mediware.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sukaina.mediware.entities.Medication;
import java.util.List;
import java.util.Optional;
import com.sukaina.mediware.entities.User;

public interface MedicationRepository extends JpaRepository<Medication, Long> {

    List<Medication> findByUser(User user);
    Optional<Medication> findByIdAndUser(Long id, User user);

}
