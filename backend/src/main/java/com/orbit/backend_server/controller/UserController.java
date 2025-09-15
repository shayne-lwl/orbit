package com.orbit.backend_server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.orbit.backend_server.service.UserService;
import com.orbit.backend_server.model.User;
import com.orbit.backend_server.dto.UserRegistrationDTO;

@RestController // Combines @Controller and @ResponseBody for all methods
@RequestMapping("/api/users") // Sets the base path for all endpoints in this controller
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> userRegistration(@RequestBody UserRegistrationDTO request) { // @RequestBody convert the JSON data from HTTP request body into a Java object
        User createdUser = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
}
