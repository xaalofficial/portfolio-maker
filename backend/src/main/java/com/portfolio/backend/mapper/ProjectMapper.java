package com.portfolio.backend.mapper;

import com.portfolio.backend.dto.ProjectDTO;
import com.portfolio.backend.model.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    ProjectDTO toDTO(Project project);

    // Optional: handle enum conversion explicitly if needed
    @Mappings({
            @Mapping(target = "status", expression = "java(com.portfolio.backend.model.ProjectStatus.valueOf(dto.getStatus()))")
    })
    Project toEntity(ProjectDTO dto);
}
