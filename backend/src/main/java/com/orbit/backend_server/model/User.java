package com.orbit.backend_server.model;
import jakarta.persistence.*;

import java.util.UUID;
import java.time.LocalDate;
import java.time.LocalDateTime;

// @Entity annotation tells Spring Boot's JPA that this class is an entity and should be mapped to a database table. 
@Entity
@Table(name= "users")
public class User {

    // Fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Inidicates that the ID will be automatically generated upon user creation
    private UUID id;

    @Column(nullable= false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private LocalDate registrationDate;

    @Column(nullable = false) 
    private LocalDateTime lastSeen;

    @Column(nullable = false)
    private boolean isOnline;

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

    // Getter Methods
    public UUID getID() {
        return this.id;
    }

    public String getUsername() {
        return this.username;
    }

    public String getEmail() {
        return this.email;
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
}
