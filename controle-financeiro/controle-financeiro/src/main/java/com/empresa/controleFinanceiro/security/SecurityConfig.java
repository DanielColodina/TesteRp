package com.empresa.controleFinanceiro.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity

public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws  Exception {

        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth-> auth
                        .requestMatchers("/index.html").permitAll()
                        .requestMatchers("/api/controlefinanceiro/health").permitAll()
                        .requestMatchers("/api/controlefinanceiro/**").hasRole("FINANCEIRO")
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public UserDetailsService users() {
        UserDetails user = User
                .withUsername("admin")
                .password("{noop}123")
                .roles("FINANCEIRO")
                .build();
        return new InMemoryUserDetailsManager(user);
    }
}
