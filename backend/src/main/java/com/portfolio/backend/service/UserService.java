package com.portfolio.backend.service;

import com.portfolio.backend.dto.UserDTO;

public interface UserService {
    UserDTO getUserProfile(String username);
    void updateUserProfile(String username, UserDTO userDTO);
}
