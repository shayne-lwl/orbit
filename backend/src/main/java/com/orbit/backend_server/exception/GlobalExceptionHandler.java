package com.orbit.backend_server.exception;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice // Tells Spring that "this class handles exceptinos for ALL controllers";
public class GlobalExceptionHandler {   
    @ExceptionHandler(IllegalArgumentException.class) // Tells Spring "when any controller throws IllegalArgumentException, call this method"
    public ResponseEntity<Map<String, String>> handleValiditionError(IllegalArgumentException error) {
        Map<String, String> errorResponse = Map.of("error", error.getMessage()); // Creates a new map with "error" as key and actual error value message from the "error" argument
        // Returns HTTP 400 status with error message when GlobalExceptionHandler 
        // catches IllegalArgumentException from any controller's service call
        return ResponseEntity.badRequest().body(errorResponse); 
    }
}
