package com.ecoguardians.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImpactDTO {
    private Long totalDeaths;
    private Long totalInjured;
    private Long totalSick;
    private Long totalHomeless;
    private Long totalDisplaced;
    private Long totalOthers;
    private Long totalAffected;
    private Long grandTotal;
}
