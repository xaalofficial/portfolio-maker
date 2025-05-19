package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProjectDTO;

import java.util.List;

public interface ProjectService {
    List<ProjectDTO> getUserProjects(String username);
    ProjectDTO createProject(String username, ProjectDTO dto);
    void deleteProject(Long projectId, String username);
}
