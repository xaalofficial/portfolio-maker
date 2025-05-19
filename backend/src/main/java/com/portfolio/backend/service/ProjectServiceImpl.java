package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProjectDTO;
import com.portfolio.backend.mapper.ProjectMapper;
import com.portfolio.backend.model.Project;
import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.ProjectRepository;
import com.portfolio.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserRepository userRepository,
                              ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    public List<ProjectDTO> getUserProjects(String username) {
        User user = userRepository.findUserByUsername(username);
        return user.getProjects()
                .stream()
                .map(projectMapper::toDTO)
                .toList();
    }

    @Override
    public ProjectDTO createProject(String username, ProjectDTO dto) {
        User user = userRepository.findUserByUsername(username);
        Project project = projectMapper.toEntity(dto);
        project.setUser(user);
        return projectMapper.toDTO(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Not found"));
        if (!project.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        projectRepository.delete(project);
    }
}

