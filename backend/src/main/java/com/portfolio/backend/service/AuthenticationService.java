package com.portfolio.backend.service;

import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private UserRepository userRepository;
    public boolean authenticate(String username, String password) {
        User user = userRepository.findUserByUsername(username);
        if(user == null) {
            return false;
        }
        return user.getPassword().equals(password);
    }
}
