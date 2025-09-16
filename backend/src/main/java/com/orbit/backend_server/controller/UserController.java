package com.orbit.backend_server.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.orbit.backend_server.service.UserService;
import com.orbit.backend_server.model.User;
import com.orbit.backend_server.dto.EmailVerficiationDTO;
import com.orbit.backend_server.dto.ResendCodeDTO;
import com.orbit.backend_server.dto.UserLoginDTO;
import com.orbit.backend_server.dto.UserRegistrationDTO;

@RestController // Combines @Controller and @ResponseBody for all methods
@RequestMapping("/api/users") // Sets the base path for all endpoints in this controller
@CrossOrigin(origins = "http://localhost:3000") 
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> userRegistration(@RequestBody UserRegistrationDTO request) { // @RequestBody convert the JSON data from HTTP request body into a Java object
        User createdUser = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PostMapping("/register/verify-email")
    public ResponseEntity<Map<String,String>> verifyEmail(@RequestBody EmailVerficiationDTO request) {
       userService.verifyEmail(request.getEmail(), request.getVerificationCode());
       return ResponseEntity.status(HttpStatus.OK).body(Map.of("Message", "Email verified successfully"));
    }

    @PostMapping("/register/resend-verification-code") 
    public ResponseEntity<Map<String, String>> resendVerification(@RequestBody ResendCodeDTO request) {
        userService.resendVerificationCode(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Verification code sent"));
    }

    @PostMapping("/login")
    public ResponseEntity<User> userLogin(@RequestBody UserLoginDTO request) {
        User signedInUser = userService.loginUser(request);
        return ResponseEntity.status(HttpStatus.OK).body(signedInUser);
    }    
}
