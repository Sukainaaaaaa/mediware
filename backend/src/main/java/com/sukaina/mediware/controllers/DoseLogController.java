package com.sukaina.mediware.controllers;

import org.springframework.web.bind.annotation.*;
import com.sukaina.mediware.services.DoseLogService;
import com.sukaina.mediware.dto.CreateDoseLogRequest;
import com.sukaina.mediware.dto.DoseLogResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.sukaina.mediware.entities.User;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dose-logs")
public class DoseLogController {

    private final DoseLogService doseLogService;

    public DoseLogController(DoseLogService doseLogService) {
        this.doseLogService = doseLogService;
    }

    @PostMapping("/")
    public ResponseEntity<DoseLogResponse> logDose(
            @Valid @RequestBody CreateDoseLogRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        DoseLogResponse doseLog = doseLogService.logDose(request, user);

        if (doseLog == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(doseLog);
    }

    @GetMapping("/")
    public List<DoseLogResponse> getDoseLogs(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return doseLogService.getDoseLogsForUser(user);
    }

    @DeleteMapping("/medications/{medicationId}/dates/{doseDate}/doses/{doseIndex}")
    public ResponseEntity<Void> deleteDoseLog(
            @PathVariable Long medicationId,
            @PathVariable LocalDate doseDate,
            @PathVariable Integer doseIndex,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean deleted = doseLogService.deleteDoseLog(
                medicationId,
                doseDate,
                doseIndex,
                user);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

}
