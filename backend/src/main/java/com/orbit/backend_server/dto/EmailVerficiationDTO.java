package com.orbit.backend_server.dto;

public class EmailVerficiationDTO {
    private String email;
    private String verificationCode;

    public void setEmail(String email) {
        this.email = email;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public String getEmail() {
        return this.email;
    }

    public String getVerificationCode() {
        return this.verificationCode;
    }
}


