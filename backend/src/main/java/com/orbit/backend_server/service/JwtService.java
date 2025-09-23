package com.orbit.backend_server.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    /* 
        Tells Spring Boot to look for a property named security.jwt.secret-key and security.jwt.expiration-time in our application's configuraiton files.
        ${} is Spring Expression Langugae expression which is a property placeholder expression. 
    */
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Retrieve the essential user information and then creates a token with default settings. 
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    // This is where JWT construction happens. 
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims) // Add custom information you want to include in the tokem
                .setSubject(userDetails.getUsername()) // Indicate who this token belong to
                .setIssuedAt(new Date(System.currentTimeMillis())) 
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) //  Use the cryptographic key to create a signature
                .compact(); // converts the entire structure into the familiar JWT string format with its characteristics three parts separated by dots
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public long getExpirationTime() {
        return jwtExpiration;
    }

    public String extractUsername(String token) {
        // Claims are pieces of information about the user that get embedded in the token. The Claims object is essentially a container that holds all this information in a structred way.
        return extractClaim(token, Claims::getSubject);  // Claims::getSubject is Java method reference syntax
    }

    // Designed for precision as most of the time we only need username or the token expiration date data or a specific custom piece of data. 
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        /* 
            The return type of extractClaim matches the return type of the claimsResolver function.
            extractClaim returns whatever type T is. Hence, when we pass Claims::getSubject, getSubject() returns T
            so T becomes a String type and therefore, extractClaim returns String.
            Function<Claims, T> parameter allows different extraction strategies to be passed in at runtime. 
        */

        return claimsResolver.apply(claims); 
    }

    // Retrieve the encoded string and transforms it back into a structured Claims object that you can work with. 
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder() // Create a JWT parser
                .setSigningKey(getSignInKey()) // Tell it how to verify the signature
                .build() // Build the configured parser
                .parseClaimsJws(token) // Parse and verify the token
                .getBody(); // Extract just the claims portion
    }


    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


    // Handles the conversion from our configured string secret to the cryptographic key object needed for JWT operations
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey); // Converts Base64 string and converts it back into its original binary format.
        return Keys.hmacShaKeyFor(keyBytes); // Transform raw byes into a proper cryptographic Key object.
    }
}
