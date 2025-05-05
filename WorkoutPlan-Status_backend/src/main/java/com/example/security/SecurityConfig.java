package com.example.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .requestMatchers("/", "/home", "/login**", "/webjars/**", "/error**").permitAll() // Allow all users to access these paths
            .anyRequest().permitAll() // Allow all requests without authentication
            .and()
            .csrf().disable()  // Disable CSRF (Cross-Site Request Forgery) protection
            .httpBasic().disable()  // Disable basic authentication
            .formLogin().disable()  // Disable form login
            .logout().disable();  // Disable logout

        return http.build();
    }
}
