package com.sukaina.mediware.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sukaina.mediware.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}