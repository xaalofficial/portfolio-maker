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
    public String login(@ResquestParam String username, @RequestParam String password){
        boolean authenticated = authenticationService.authenticate(username, password);
        if(authenticated) {
            return "TOKEN";
        }
        else {
            throw new RuntimeException("Invalid username or password");
        }
    }
}
