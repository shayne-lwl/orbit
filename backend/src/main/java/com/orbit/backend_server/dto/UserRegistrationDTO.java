package com.orbit.backend_server.dto;

public class UserRegistrationDTO {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;

    // Getters 
    public String getUsername() {
        return this.username;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public String getconfirmPassword() {
        return this.confirmPassword;
    }

    // Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setconfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
