package com.portfolio.backend.controller;

import com.portfolio.backend.dto.UserDTO;
import com.portfolio.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMyProfile(Principal principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateMyProfile(Principal principal,
                                                @RequestBody UserDTO userDTO) {
        userService.updateUserProfile(principal.getName(), userDTO);
        return ResponseEntity.ok().build();
    }
}
