package com.portfolio.backend.controller;

import com.portfolio.backend.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Allow React app to talk to backend
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password){
        return authenticationService.authenticate(username, password);
    }

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password) {
        authenticationService.register(username, password);
        return "User registered successfully";
    }

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "You accessed a protected API!";
    }

}
