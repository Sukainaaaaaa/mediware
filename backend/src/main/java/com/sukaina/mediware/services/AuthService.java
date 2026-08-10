package com.sukaina.mediware.services;

import org.springframework.stereotype.Service;
import com.sukaina.mediware.repositories.UserRepository;

import com.sukaina.mediware.dto.RegisterRequest;
import com.sukaina.mediware.dto.AuthResponse;
import com.sukaina.mediware.entities.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.sukaina.mediware.dto.LoginRequest;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getName(), user.getEmail(), user.getId());
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(registerRequest.getFirstName() + " " + registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getId());
    }


}
