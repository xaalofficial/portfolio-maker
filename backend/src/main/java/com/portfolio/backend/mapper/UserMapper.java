package com.portfolio.backend.mapper;

import com.portfolio.backend.dto.UserDTO;
import com.portfolio.backend.model.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    private final ProjectMapper projectMapper;

    public UserMapper(ProjectMapper projectMapper) {
        this.projectMapper = projectMapper;
    }

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setAvatar(user.getAvatar());
        dto.setLocation(user.getLocation());
        dto.setSkills(user.getSkills());

        dto.setProjects(user.getProjects()
                .stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList()));

        return dto;
    }
}
