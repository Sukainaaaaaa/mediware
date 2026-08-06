package com.sukaina.mediware.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sukaina.mediware.entities.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
}