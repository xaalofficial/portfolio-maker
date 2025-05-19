package com.portfolio.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProjectDTO {
    // Setters
    // Getters
    private Long id;
    private String title;
    private String description;
    private String repoLink;
    private String technologies;
    private String screenshot;
    private String status; // string representation of enum

}
