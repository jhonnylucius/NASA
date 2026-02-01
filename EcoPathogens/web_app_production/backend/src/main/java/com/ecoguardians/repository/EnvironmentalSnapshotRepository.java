package com.ecoguardians.repository;

import com.ecoguardians.model.EnvironmentalSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EnvironmentalSnapshotRepository extends JpaRepository<EnvironmentalSnapshot, Long> {

    List<EnvironmentalSnapshot> findByEventYear(Integer year);

    List<EnvironmentalSnapshot> findByEventDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT e FROM EnvironmentalSnapshot e WHERE e.sourceApi = :sourceApi AND e.eventDate >= :since")
    List<EnvironmentalSnapshot> findRecentBySource(String sourceApi, LocalDate since);
}
