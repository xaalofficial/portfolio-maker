package com.portfolio.backend.model;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private String repoLink;

    @ElementCollection
    private List<String> technologies;

    private String screenshot;    // URL to screenshot image

    @Setter
    @Getter
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;


    // Many projects belong to one user
    @ManyToOne
    @JoinColumn(name = "username", nullable = false)
    private User user;
}
