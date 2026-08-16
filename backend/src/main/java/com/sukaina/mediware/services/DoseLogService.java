package com.sukaina.mediware.services;

import org.springframework.stereotype.Service;
import com.sukaina.mediware.repositories.DoseLogRepository;

@Service
public class DoseLogService {

    private final DoseLogRepository doseLogRepository;

    public DoseLogService(DoseLogRepository doseLogRepository) {
        this.doseLogRepository = doseLogRepository;
    }

}