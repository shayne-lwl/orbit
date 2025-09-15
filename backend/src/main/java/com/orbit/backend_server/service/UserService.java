package com.orbit.backend_server.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.orbit.backend_server.repository.UserRepository;
import com.orbit.backend_server.model.User;
import com.orbit.backend_server.dto.UserRegistrationDTO;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired 
    private PasswordEncoder passwordEncoder;

    public User registerUser(UserRegistrationDTO request) {
        // Request data validation 
        String usernamePattern = "^[A-Za-z0-9_]*$";
        if(request.getUsername().length() < 5 || request.getUsername().length() > 15) {
            throw new IllegalArgumentException("Username must be at least 5 characters long and cannot be longer than 15 characters");
        } else if(!Pattern.matches(usernamePattern,request.getUsername())) {
            throw new IllegalArgumentException("Username must start with a letter or number and can only contain letters, numbers, and underscores.");
        } else if(userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        String emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        if(!Pattern.matches(emailPattern, request.getEmail())) {
            throw new IllegalArgumentException("Invalid email address");
        } else if(userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email address already exists");
        }

        if(!request.getPassword().equals(request.getPasswordConfirmation())) {
            throw new IllegalArgumentException("Password confirmation does not match");
        }

        String passwordPattern = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,32}$";
        if (request.getPassword().length() < 8 || request.getPassword().length() > 32) {
            throw new IllegalArgumentException("Password must be 8 to 32 characters");
        } else if(!Pattern.matches(passwordPattern, request.getPassword())) {
            throw new IllegalArgumentException("Password must include uppercase, lowercase, numbers, and symbols");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }
}
