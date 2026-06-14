package com.aimock.interview.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "interview_id")
    private Interview interview;
    
    @Column(columnDefinition = "TEXT")
    private String text;
    
    @Column(columnDefinition = "TEXT")
    private String answer;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    private Integer score;
}
