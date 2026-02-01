package com.ecoguardians.controller;

import com.ecoguardians.model.EnvironmentalSnapshot;
import com.ecoguardians.service.HistoricalDataSeeder;
import com.ecoguardians.service.NasaDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/nasa")
@CrossOrigin(origins = "*") // Allow frontend access
public class NasaProxyController {

    @Autowired
    private NasaDataService nasaDataService;

    @Autowired
    private HistoricalDataSeeder historicalSeeder;

    @GetMapping("/eonet")
    public List<EnvironmentalSnapshot> getEonetData(@RequestParam(defaultValue = "20") int days) {
        return nasaDataService.fetchAndSaveEonetData(days);
    }

    @GetMapping("/firms")
    public List<EnvironmentalSnapshot> getFirmsData(
            @RequestParam(defaultValue = "VIIRS_NOAA20_NRT") String sensor,
            @RequestParam(defaultValue = "world") String area,
            @RequestParam(defaultValue = "1") int days) {
        return nasaDataService.fetchAndSaveFirmsData(sensor, area, days);
    }

    @PostMapping("/admin/seed-history")
    public CompletableFuture<String> seedHistory(@RequestParam int startYear, @RequestParam int endYear) {
        return historicalSeeder.startSeeding(startYear, endYear);
    }
}
