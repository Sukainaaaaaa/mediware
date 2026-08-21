package com.sukaina.mediware.controllers;

import org.springframework.web.bind.annotation.*;
import com.sukaina.mediware.entities.User;
import com.sukaina.mediware.dto.UpdateUserRequest;
import com.sukaina.mediware.dto.UserResponse;
import com.sukaina.mediware.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return userService.toUserResponse(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        try {
            return ResponseEntity.ok(userService.updateCurrentUser(request, user));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        userService.deleteCurrentUser(user);
        return ResponseEntity.noContent().build();
    }
}
