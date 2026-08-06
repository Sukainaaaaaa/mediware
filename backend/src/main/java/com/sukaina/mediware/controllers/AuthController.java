package com.sukaina.mediware.controllers;

import org.springframework.web.bind.annotation.*;
import com.sukaina.mediware.services.AuthService;
import com.sukaina.mediware.dto.AuthResponse;
import com.sukaina.mediware.dto.LoginRequest;
import com.sukaina.mediware.dto.RegisterRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

}
