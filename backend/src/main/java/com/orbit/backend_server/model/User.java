package com.orbit.backend_server.model;
import jakarta.persistence.*;

// @Entity annotation tells Spring Boot's JPA that this calss is an entity and should be mapped to a database table. 
@Entity
@Table(name= "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Inidicates that the ID will be automatically generated upon user creation
    private Long id;

    @Column(nullable= false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    public User() {

    }

    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }

}
