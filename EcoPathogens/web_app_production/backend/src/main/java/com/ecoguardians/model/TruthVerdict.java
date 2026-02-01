package com.ecoguardians.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "truth_verdicts")
public class TruthVerdict {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "atlas_year")
    private Integer atlasYear;

    @Column(name = "atlas_location")
    private String atlasLocation;

    private String verdict;

    @Column(name = "evidence_text")
    private String evidenceText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public Integer getAtlasYear() { return atlasYear; }
    public void setAtlasYear(Integer atlasYear) { this.atlasYear = atlasYear; }
    public String getAtlasLocation() { return atlasLocation; }
    public void setAtlasLocation(String atlasLocation) { this.atlasLocation = atlasLocation; }
    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }
    public String getEvidenceText() { return evidenceText; }
    public void setEvidenceText(String evidenceText) { this.evidenceText = evidenceText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
