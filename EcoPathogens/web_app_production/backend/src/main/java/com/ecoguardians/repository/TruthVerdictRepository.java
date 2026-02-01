package com.ecoguardians.repository;

import com.ecoguardians.model.TruthVerdict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TruthVerdictRepository extends JpaRepository<TruthVerdict, Long> {
}
