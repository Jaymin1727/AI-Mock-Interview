package com.aimock.interview.repository;

import com.aimock.interview.model.Question;
import com.aimock.interview.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByInterview(Interview interview);
}
