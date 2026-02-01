package com.ecoguardians;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EcoGuardiansApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcoGuardiansApplication.class, args);
	}

}
