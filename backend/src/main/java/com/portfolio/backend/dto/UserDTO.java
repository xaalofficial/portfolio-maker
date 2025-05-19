package com.portfolio.backend.dto;
import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private String username;
    private String email;
    private String bio;
    private String avatar;
    private String location;
    private List<String> skills;
    private List<ProjectDTO> projects;
}
