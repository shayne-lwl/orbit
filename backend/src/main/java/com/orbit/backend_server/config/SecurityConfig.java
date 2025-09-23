package com.orbit.backend_server.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.orbit.backend_server.repository.UserRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    @Lazy // @Lazy tells Spring to delay the creation and injection of a bean unitl it's actually needed, rather than creating it immediately during application startup.
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() { // Return a PasswordEncoder interface 
        return new BCryptPasswordEncoder(12);
    }

    // Set of rules that Spring Security will apply to every rquest that comes to your application
   @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // We don't need csrf since we are using JWK tokens which utilizes headers and not cookies
            .authorizeHttpRequests(requests -> requests
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Never create HTTP sessions
            )
            .authenticationProvider(authenticationProvider()) // Register our custom Authentcation Provider and is used when AutnenticationManager.authenticate() is called (during login)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Adds our JwtAuthenticationFilter to the security filter chain and make it run before the UsernamePasswordAuthenticationFilter
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration(); 

        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); // Creates a source that can apply different CORS configurations to different URL patterns
        source.registerCorsConfiguration("/**", configuration); // Applies our CORS configuration to all api endpoints /** 

        return source;
    }

    // UserDetailsService is a functional interface with one method: loadUserByUsername(String username). username -> provides the implementation
    @Bean
    public UserDetailsService userDetailsService() { 
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /*
     * AuthenticationConfiguration is a configuration class Spring Security uses internally to build and configure the authentication system. Think of it as a 
     * factory that craetes authentication components. It collects all our authentication-related beans, then builds and configures the AuthenticationManager. 
     * AuthenticationManager is the main interface responsible for processing authentication requests. It is the central component that coordinates the actual 
     * authentication process. 
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception { // Exposes Spring Security's AuthenticationManager so we can inject it into other parts of the application.
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService()); // Tells DaoAuthenticationProvider: "When you need to find a user during authentication, use this UserDetailsService"
        authProvider.setPasswordEncoder(passwordEncoder()); // Tells DaoAuthenticationProvider: "When you need to verify passwords, use this PasswordEncoder."

        return authProvider;
    }

}
