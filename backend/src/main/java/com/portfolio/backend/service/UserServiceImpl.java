package com.portfolio.backend.service;

import com.portfolio.backend.dto.UserDTO;
import com.portfolio.backend.mapper.UserMapper;
import org.springframework.stereotype.Service;
import com.portfolio.backend.dto.ProjectDTO;
import com.portfolio.backend.mapper.ProjectMapper;
import com.portfolio.backend.model.Project;
import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.ProjectRepository;
import com.portfolio.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserDTO getUserProfile(String username) {
        User user = userRepository.findUserByUsername(username);
        return userMapper.toDTO(user);
    }

    @Override
    public void updateUserProfile(String username, UserDTO userDTO) {
        User user = userRepository.findUserByUsername(username);
        user.setBio(userDTO.getBio());
        user.setLocation(userDTO.getLocation());
        user.setSkills(userDTO.getSkills());
        user.setEmail(userDTO.getEmail());
        user.setAvatar(userDTO.getAvatar());
        userRepository.save(user);
    }
}
