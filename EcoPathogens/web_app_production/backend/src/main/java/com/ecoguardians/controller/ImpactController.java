package com.ecoguardians.controller;

import com.ecoguardians.model.ImpactDTO;
import com.ecoguardians.repository.HumanDamageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/impact")
public class ImpactController {

    @Autowired
    private HumanDamageRepository repository;

    @GetMapping
    public ResponseEntity<ImpactDTO> getImpactStats() {
        ImpactDTO stats = repository.getAggregatedStats();
        // If table is empty, return empty DTO
        if (stats == null) {
            stats = new ImpactDTO(0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L);
        }
        return ResponseEntity.ok(stats);
    }
}
