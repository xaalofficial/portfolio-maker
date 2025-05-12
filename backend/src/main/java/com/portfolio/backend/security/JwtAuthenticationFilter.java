package com.portfolio.backend.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;



import java.io.IOException;

@Component
@WebFilter(urlPatterns = "/api/*")  // You can limit it to certain endpoints if needed
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Step 1: Get the token from the Authorization header
        String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);  // Extract token from "Bearer <token>"
            try {
                username = jwtUtil.getUsernameFromToken(jwtToken);  // Get username from token
            } catch (ExpiredJwtException e) {
                logger.error("Expired JWT token", e);
            } catch (Exception e) {
                logger.error("Invalid JWT token", e);
            }
        }

        // Step 2: If token is valid, authenticate the user
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Normally, you'd load user details here (for now we skip user detail loading)
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, null, null);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        // Step 3: Continue the request
        filterChain.doFilter(request, response);
    }
}