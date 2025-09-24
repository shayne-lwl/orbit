package com.orbit.backend_server.service;

import java.util.regex.Pattern;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.apache.commons.lang3.RandomStringUtils;

import com.orbit.backend_server.repository.UserRepository;
import com.orbit.backend_server.model.User;
import com.orbit.backend_server.dto.UserLoginDTO;
import com.orbit.backend_server.dto.UserRegistrationDTO;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired 
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    private AuthenticationManager authenticationManager;

    public UserService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public User registerUser(UserRegistrationDTO request) {
        // Request data validation 
        String usernamePattern = "^[A-Za-z0-9_]*$";
        if(request.getMyUsername().length() < 5 || request.getMyUsername().length() > 15) {
            throw new IllegalArgumentException("Username must be at least 5 characters long and cannot be longer than 15 characters");
        } else if(!Pattern.matches(usernamePattern,request.getMyUsername())) {
            throw new IllegalArgumentException("Username must start with a letter or number and can only contain letters, numbers, and underscores.");
        } else if(userRepository.existsByUsername(request.getMyUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        String emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        if(!Pattern.matches(emailPattern, request.getEmail())) {
            throw new IllegalArgumentException("Invalid email address");
        } else if(userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email address already exists");
        }

        if(!request.getPassword().equals(request.getconfirmPassword())) {
            System.out.println(request.getPassword());
            System.out.println(request.getconfirmPassword());
            throw new IllegalArgumentException("Password confirmation does not match");
        }

        String passwordPattern = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,32}$";
        if (request.getPassword().length() < 8 || request.getPassword().length() > 32) {
            throw new IllegalArgumentException("Password must be 8 to 32 characters");
        } else if(!Pattern.matches(passwordPattern, request.getPassword())) {
            throw new IllegalArgumentException("Password must include uppercase, lowercase, numbers, and symbols");
        }

        User user = new User();
        user.setUsername(request.getMyUsername());
        user.setEmail(request.getEmail());
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(hashedPassword);
        user.setIsEnabled(false); // Disabled the user account until verfication is completed

        // Generate verification code
        String verifcationCode = RandomStringUtils.randomAlphanumeric(6);
        user.setVerificationCode(verifcationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));
        
        User savedUser = userRepository.save(user);

        // Send the email
        emailService.sendVerifcationEmail(user.getEmail(), user.getMyUsername(), verifcationCode);

        return savedUser;
    }

    // Email Verifcation Logic
    public User verifyEmail(String email, String password, String verifcationCode) {
        User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(user.getIsEnabled()) {
            throw new IllegalArgumentException("Email address already verified");
        }

        if(user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code expired. Please resend a new verification code.");
        }

        if(!user.getVerificationCode().equals(verifcationCode)) {
            throw new IllegalArgumentException("Invalid verification code");
        }

        user.setIsEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );
        userRepository.save(user);
        return user;
    }

    public void resendVerificationCode(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()) {
            User user = userOptional.get();
            if(!LocalDateTime.now().minusMinutes(1).isAfter(user.getVerificationCodeExpiry())) {
                throw new IllegalArgumentException("Please wait 60 seconds to resend.");
            }

            if(user.getIsEnabled()) {
                throw new IllegalArgumentException("Email address already verified");
            }

            String newVerifcationCode = RandomStringUtils.randomAlphanumeric(6);
            user.setVerificationCode(newVerifcationCode);
            user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);
            emailService.sendVerifcationEmail(email, user.getMyUsername(), newVerifcationCode); 
        }
    }

    public User loginUser(UserLoginDTO request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if(userOptional.isPresent()) {
            User user = userOptional.get(); // Retrieve the actual User entity if userOptional exists
            if(passwordEncoder.matches(request.getPassword(), user.getPassword())) { // Compare the stored password and request password
                user.setLastSeen(LocalDateTime.now());
                user.toggleOnlineStatus();
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
                );
                return userRepository.save(user);
            }

            if(user.getIsEnabled() == false) {
                throw new IllegalArgumentException("Invalid email or password");
            }
        }

        throw new IllegalArgumentException("Invalid email or password");
    }
}
