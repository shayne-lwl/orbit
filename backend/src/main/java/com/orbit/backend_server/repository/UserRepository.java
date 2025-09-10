package com.orbit.backend_server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.Optional;

import com.orbit.backend_server.model.User;

@Repository
// <User, UUID> is a syntax that uses Java Generics to tell JpaRepositroy what kind of data it it working with. 
// The first parameter is the entity class that this repository will manage and the second parameter is the data type of the primary key inside that entity class.
public interface UserRepository extends JpaRepository<User, UUID> { 
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID id);
    Optional<User> findByUsernameOrEmail(String username, String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
