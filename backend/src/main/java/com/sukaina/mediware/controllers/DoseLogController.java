package com.sukaina.mediware.controllers;

import org.springframework.web.bind.annotation.*;
import com.sukaina.mediware.services.DoseLogService;
import com.sukaina.mediware.dto.CreateDoseLogRequest;
import com.sukaina.mediware.dto.DoseLogResponse;
import org.springframework.security.core.Authentication;
import com.sukaina.mediware.entities.User;

@RestController
@RequestMapping("/api/dose-logs")
public class DoseLogController {

private final DoseLogService doseLogService;

    public DoseLogController(DoseLogService doseLogService) {
        this.doseLogService = doseLogService;
    }

    @PostMapping("/")
    public DoseLogResponse logDose(@RequestBody CreateDoseLogRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return doseLogService.logDose(request, user);
    }

   
}