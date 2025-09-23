package com.orbit.backend_server.model;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;

// @Entity annotation tells Spring Boot's JPA that this class is an entity and should be mapped to a database table. 
@Entity
@Table(name= "users")
public class User implements UserDetails{ // The UserDetails interface is a translator that takes our custom user data and presents it in a way Spring Secuirty can understand.

    // UserDetails Required Methods
    @Override
    /* 
     * ? is called a wildcard and it means "some type, but I am not specifying exactly which type."
     * GrantedAuthority is Spring Security's way of representing a single permission or role that a user has. 
     * Hence, Collection<GrantedAuthority> means a collection that holds multiple permissions or roles. 
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    // Fields
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Inidicates that the ID will be automatically generated upon user creation
    private UUID id;

    @Column(nullable= false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String password;

    @Column(nullable = false)
    @CreationTimestamp // Auto generate a timestamp on user creation
    private LocalDate registrationDate;

    @Column(nullable = false) 
    @CreationTimestamp 
    private LocalDateTime lastSeen;

    @Column(nullable = false)
    private boolean isOnline;

    @Column(length = 6)
    private String verificationCode;

    private LocalDateTime verificationCodeExpiry;

    @Column(nullable = false)
    private boolean isEnabled;

    // Constructors
    // No argument constructor (for JPA)
    public User() {

    }
    // Parameterized constructor 
    public User(String username, String email, LocalDate registrationDate, LocalDateTime lastSeen) {
        this.username = username;
        this.email = email;
        this.registrationDate = registrationDate;
        this.lastSeen = lastSeen;  
    }

    // Setter Methods
    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void toggleOnlineStatus() {
        this.isOnline = !this.isOnline;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setLastSeen(LocalDateTime lastSeen) {
        this.lastSeen = lastSeen;
    }

    public void setVerificationCode(String code) {
        this.verificationCode = code;
    }

    public void setIsEnabled(boolean status) {
        this.isEnabled = status;
    }

    public void setVerificationCodeExpiry(LocalDateTime expiration) {
        this.verificationCodeExpiry = expiration;
    }

    // Getter Methods
    public UUID getId() {
        return this.id;
    }

    public String getMyUsername() {
        return this.username;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public LocalDate getRegistrationDate() {
        return this.registrationDate;
    }

    public LocalDateTime getLastSeen() {
        return this.lastSeen;
    }

    public boolean getOnlineStatus() {
        return this.isOnline;
    }

    public String getVerificationCode() {
        return this.verificationCode;
    }

    public LocalDateTime getVerificationCodeExpiry() {
        return this.verificationCodeExpiry;
    }

    public boolean getIsEnabled() {
        return this.isEnabled;
    }
}
