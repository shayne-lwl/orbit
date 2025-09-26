package com.orbit.backend_server.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.orbit.backend_server.model.User;

public class UserResponseDTO {
    private UUID id;
    private String myUsername;
    private String email;
    private boolean isEnabled; 
    private LocalDateTime lastSeen;
    private boolean onlineStatus;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.myUsername = user.getMyUsername();
        this.email = user.getEmail();
        this.isEnabled = user.getIsEnabled();
        this.lastSeen = user.getLastSeen();
        this.onlineStatus = user.getOnlineStatus();
    }

    public UUID getId() {
        return this.id;
    }

    public String getMyUsername() {
        return this.myUsername;
    }

    public String getEmail() {
        return this.email;
    }

    public boolean getIsEnabled() {
        return this.isEnabled;
    }

    public LocalDateTime getLastSeen() {
        return this.lastSeen;
    }

    public boolean getOnlineStatus() {
        return this.onlineStatus;
    }

}
