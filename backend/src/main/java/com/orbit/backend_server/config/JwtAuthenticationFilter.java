package com.orbit.backend_server.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.orbit.backend_server.service.JwtService;

import io.micrometer.common.lang.NonNull;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter { // OncePerRequest ensures this filter runs exactly once per request
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter (JwtService jwtService, UserDetailsService userDetailsService, HandlerExceptionResolver handlerExceptionResolver) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    // This method runs for every HTTP request to our application
    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request, 
        @NonNull HttpServletResponse response, 
        @NonNull FilterChain filterChain) throws ServletException, IOException {
            final String authHeader = request.getHeader("Authorization"); // Extracts Authorization header

            // If Authorization header does not exists or not starts with "Bearer" we skip the JWT processing and continues to the next filter.
            if(authHeader == null || !authHeader.startsWith("Bearer ")) { 
                filterChain.doFilter(request, response);
                return;
            }

            // Extract and Parse JWT Token
            try {
                final String jwt = authHeader.substring(7); // Removes the "Bearer" prefix
                final String userEmail = jwtService.extractUsername(jwt); // Use JwtService to extract the username/email from the token 
                
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // Get the current authentication from Spring Security's Context

                // Only proceeds if Token contained a valid username/email and user is not already authenticated.
                if(userEmail != null && authentication == null) {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail); // Load full user details from database

                    // Validates the JWT token against the user details (checks expiration, signature, etc.)
                    if(jwtService.isTokenValid(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
                /* 
                   Continue the filter chain and pass the request to the next filter in the chain. The request eventually reaches our controller methods
                   and our controllers can now access the authenticated user.
                 */ 
                filterChain.doFilter(request, response);
            } catch(Exception exception) {
                handlerExceptionResolver.resolveException(request, response, null, exception); // Catch any errrrs during JWT processing and prevents the application from crashing on invalid tokens 
            }
    }
}   
