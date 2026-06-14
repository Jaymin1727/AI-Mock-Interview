package com.aimock.interview.repository;

import com.aimock.interview.model.Interview;
import com.aimock.interview.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserOrderByStartTimeDesc(User user);
}
