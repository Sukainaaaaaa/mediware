package com.sukaina.mediware.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import java.util.*;
import com.sukaina.mediware.services.MedicationService;
import com.sukaina.mediware.entities.User;
import com.sukaina.mediware.dto.CreateMedicationRequest;
import com.sukaina.mediware.dto.MedicationResponse;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping("/")
    public List<MedicationResponse> getAllMedications(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return medicationService.getAllMedicationsForUser(user);
    }

    @PostMapping("/")
    public MedicationResponse createMedication(@RequestBody CreateMedicationRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return medicationService.createMedication(request, user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicationResponse> getMedicationById(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        MedicationResponse medication = medicationService.getMedicationById(id, user);

        if (medication == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(medication);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicationResponse> updateMedication(
            @PathVariable Long id,
            @RequestBody CreateMedicationRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        MedicationResponse medication = medicationService.updateMedication(id, request, user);

        if (medication == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(medication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean deleted = medicationService.deleteMedication(id, user);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

}
