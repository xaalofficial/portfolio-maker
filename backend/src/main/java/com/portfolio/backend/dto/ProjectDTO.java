package com.portfolio.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ProjectDTO {
    // Setters
    // Getters
    private Long id;
    private String title;
    private String description;
    private String repoLink;
    private List<String> technologies;
    private String screenshot;
    private String status; // string representation of enum

}
