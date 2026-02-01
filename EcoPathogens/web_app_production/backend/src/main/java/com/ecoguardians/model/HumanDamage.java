package com.ecoguardians.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "human_damages")
@Data
public class HumanDamage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer deaths;
    private Integer injured;
    private Integer sick;
    private Integer homeless;
    private Integer displaced; // Desalojados
    private Integer others;
    private Integer affected;
}
