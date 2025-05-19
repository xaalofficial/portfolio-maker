package com.portfolio.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String username;   // Primary Key (still)

    private String password;

    private String email;

    @Column(length = 1000)
    private String bio;

    private String avatar;     // This could be a URL to the avatar image

    private String location;

    @ElementCollection
    private List<String> skills;

    // One user can have many projects
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Project> projects;

}

