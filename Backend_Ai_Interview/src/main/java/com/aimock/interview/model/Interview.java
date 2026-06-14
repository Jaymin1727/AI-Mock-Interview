package com.aimock.interview.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    private String jobRole;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer overallScore;
    
    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL)
    private List<Question> questions;
    
    private String status; // COMPLETED, IN_PROGRESS
}
