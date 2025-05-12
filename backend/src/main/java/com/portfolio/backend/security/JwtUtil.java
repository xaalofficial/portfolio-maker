package com.portfolio.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour expiry
                .signWith(key)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        // Step 1: Parse and validate the JWT token using the secret key
        // If the token is invalid or tampered with, it will throw an exception
        return Jwts.parserBuilder()
                .setSigningKey(key)  // Use the signing key to validate the token's signature
                .build()             // Finalize the parser setup
                .parseClaimsJws(token)  // Parse the token and validate it (signature and claims)
                .getBody()           // Extract the body (payload) of the token
                .getSubject();       // Extract the "subject" (typically the username) from the body
    }

}
