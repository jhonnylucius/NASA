package com.ecoguardians.model;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Type;

import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.util.Map;

@Entity
@Table(name = "environmental_snapshots", indexes = {
        @Index(name = "idx_event_date", columnList = "eventDate")
})
@Data
public class EnvironmentalSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime capturedAt;

    @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime eventTime;

    @Column(nullable = false)
    private LocalDate eventDate;

    private Integer eventYear;

    @Column(length = 50)
    private String sourceApi;

    @Column(length = 50)
    private String eventType;

    // Using basic lat/lon for simplicity if PostGIS isn't installed,
    // but ideally this would be a Geometry type.
    // Given the user said "naked DB", let's stick to simple columns first
    // or use a custom type if we confirm PostGIS.
    // For now, let's store latitude and longitude separately to ensure
    // compatibility without complex setup.
    private Double latitude;
    private Double longitude;

    @Column(length = 100)
    private String regionName;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> features;

    @PrePersist
    public void prePersist() {
        if (capturedAt == null) {
            capturedAt = OffsetDateTime.now();
        }
        if (eventTime != null && eventDate == null) {
            eventDate = eventTime.toLocalDate();
            eventYear = eventDate.getYear();
        }
    }
}
