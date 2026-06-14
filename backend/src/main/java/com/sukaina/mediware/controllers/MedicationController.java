package com.sukaina.mediware.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.sukaina.mediware.Medication;
import com.sukaina.mediware.services.MedicationService;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping("/")
    public List<Medication> getAllMedications() {
        return medicationService.getAllMedications();
    }

    @PostMapping("/")
    public Medication createMedication(@RequestBody Medication medication) {
        return medicationService.createMedication(medication);
    }

    @GetMapping("/{id}")
    public Medication getMedicationById(@PathVariable Long id) {
        return medicationService.getMedicationById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteMedication(@PathVariable Long id) {
        medicationService.deleteMedication(id);
    }

}
