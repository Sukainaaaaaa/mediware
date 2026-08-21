package com.sukaina.mediware.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sukaina.mediware.dto.UpdateUserRequest;
import com.sukaina.mediware.dto.UserResponse;
import com.sukaina.mediware.entities.User;
import com.sukaina.mediware.repositories.DoseLogRepository;
import com.sukaina.mediware.repositories.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final DoseLogRepository doseLogRepository;

    public UserService(UserRepository userRepository, DoseLogRepository doseLogRepository) {
        this.userRepository = userRepository;
        this.doseLogRepository = doseLogRepository;
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }

    public UserResponse updateCurrentUser(UpdateUserRequest request, User user) {
        User existingUserWithEmail = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (
                existingUserWithEmail != null &&
                !existingUserWithEmail.getId().equals(user.getId())
        ) {
            throw new IllegalArgumentException("Email already registered");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteCurrentUser(User user) {
        doseLogRepository.deleteByUser(user);
        userRepository.delete(user);
    }
}
