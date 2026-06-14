package com.sukaina.mediware.services;

import org.springframework.stereotype.Service;
import java.util.*;
import com.sukaina.mediware.Medication;
import com.sukaina.mediware.repositories.MedicationRepository;

@Service
public class MedicationService {
    private final MedicationRepository medicationRepository;

    public MedicationService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    public Medication createMedication(Medication medication) {
        return medicationRepository.save(medication);
    }

    public Medication getMedicationById(Long id) {
        return medicationRepository.findById(id).orElse(null);
    }

    public void deleteMedication(Long id) {
        medicationRepository.deleteById(id);
    }

}
