package com.ecoguardians.repository;

import com.ecoguardians.model.HumanDamage;
import com.ecoguardians.model.ImpactDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface HumanDamageRepository extends JpaRepository<HumanDamage, Long> {

    @Query("SELECT new com.ecoguardians.model.ImpactDTO(" +
           "SUM(COALESCE(h.deaths, 0)), " +
           "SUM(COALESCE(h.injured, 0)), " +
           "SUM(COALESCE(h.sick, 0)), " +
           "SUM(COALESCE(h.homeless, 0)), " +
           "SUM(COALESCE(h.displaced, 0)), " +
           "SUM(COALESCE(h.others, 0)), " +
           "SUM(COALESCE(h.affected, 0)), " +
           "SUM(COALESCE(h.deaths, 0) + COALESCE(h.injured, 0) + COALESCE(h.sick, 0) + COALESCE(h.homeless, 0) + COALESCE(h.displaced, 0) + COALESCE(h.others, 0) + COALESCE(h.affected, 0))) " +
           "FROM HumanDamage h")
    ImpactDTO getAggregatedStats();
}
