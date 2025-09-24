package com.orbit.backend_server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendVerifcationEmail(String email, String username, String verificationCode) {
        // Send email in plain text
        /* 
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your one-time password (OTP)");
            message.setText("Your verification code is: " + verificationCode + "\nThis code expires in 5 minutes");
            mailSender.send(message); 
        */

        // Send email in HTML format
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Orbit Account Email Verification");

            // Prepare template variables
            Context context = new Context();
            context.setVariable("verificationCode", verificationCode);
            context.setVariable("username", username);
            context.setVariable("email", email);

            // Process template
            String htmlContent = templateEngine.process("email-verification", context);
            
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch(Exception error) {
            throw new RuntimeException("Failed to send verification email", error);
        }

    }
}
