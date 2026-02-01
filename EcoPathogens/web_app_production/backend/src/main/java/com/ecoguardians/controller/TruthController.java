package com.ecoguardians.controller;

import com.ecoguardians.model.TruthVerdict;
import com.ecoguardians.repository.TruthVerdictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/truth")
@CrossOrigin(origins = "*")
public class TruthController {

    @Autowired
    private TruthVerdictRepository repository;

    @GetMapping
    public List<TruthVerdict> getAllVerdicts() {
        return repository.findAll();
    }
}
