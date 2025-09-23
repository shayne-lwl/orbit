package com.orbit.backend_server.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.orbit.backend_server.service.JwtService;
import com.orbit.backend_server.service.UserService;
import com.orbit.backend_server.model.User;
import com.orbit.backend_server.dto.EmailVerficiationDTO;
import com.orbit.backend_server.dto.ResendCodeDTO;
import com.orbit.backend_server.dto.UserLoginDTO;
import com.orbit.backend_server.dto.UserRegistrationDTO;

@RestController // Combines @Controller and @ResponseBody for all methods
@RequestMapping("/api/auth") // Sets the base path for all endpoints in this controller
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<User> userRegistration(@RequestBody UserRegistrationDTO request) { // @RequestBody convert the JSON data from HTTP request body into a Java object
        User createdUser = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PostMapping("/register/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestBody EmailVerficiationDTO request) {
       User registeredUser = userService.verifyEmail(request.getEmail(),request.getPassword(), request.getVerificationCode());
       String jwtToken = jwtService.generateToken(registeredUser);
       return ResponseEntity.status(HttpStatus.OK).body(Map.of("Message", "Email verified successfully", "jwtToken", jwtToken, "user", registeredUser));
    }

    @PostMapping("/register/resend-verification-code") 
    public ResponseEntity<Map<String, String>> resendVerification(@RequestBody ResendCodeDTO request) {
        userService.resendVerificationCode(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Verification code sent"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> userLogin(@RequestBody UserLoginDTO request) {
        User signedInUser = userService.loginUser(request);
        System.out.println(signedInUser);
        String jwtToken = jwtService.generateToken(signedInUser);
        return ResponseEntity.ok(Map.of("jwtToken", jwtToken, "user", signedInUser));
    }    
}
