package com.aimock.interview.repository;

import com.aimock.interview.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByFirebaseId(String firebaseId);
    Optional<User> findByEmail(String email);
}
