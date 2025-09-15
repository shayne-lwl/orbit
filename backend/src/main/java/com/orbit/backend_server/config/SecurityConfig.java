package com.orbit.backend_server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() { // Return a PasswordEncoder interface 
        return new BCryptPasswordEncoder(12);
    }

    // Set of rules that Spring Security will apply to every rquest that comes to your application
   @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // The expected argument for authorizeHttpRequests is new Customizer<AuthorizeHttpRequestsConfigurer>() but 
        // when use with Lambda expression, the compiler knows that the parameter must match what authorizeHttpRequests() expects
        http
            .authorizeHttpRequests(request -> request // Lambda expression syntax. It is similar to JavaScript arrow function syntax
                .requestMatchers("/api/users/register").permitAll()  
                .requestMatchers("/api/users/login").permitAll()    
                .anyRequest().authenticated()                        
            )
            // If this is not disabled, Spring Security will requires a CSRF token with every POST, PUT, DELETE request 
            // and your API calls will fail with 403 Forbidden errors.
            .csrf(csrf -> csrf.disable()) 
            // If this is not disabled, Spring Security redirects unauthenticated requests to a login page. 
            // API requests expecting JSON responses get HTML login pages instead.
            // Our frontend applications received unexpected HTML instead of JSON error responses. 
            .formLogin(form -> form.disable()) 
            // To prevent browser to show authentication popup dialogs for protected endpoints. 
            .httpBasic(basic -> basic.disable()); 

        return http.build();
    }
}
