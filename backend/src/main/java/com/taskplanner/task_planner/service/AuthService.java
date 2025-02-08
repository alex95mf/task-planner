package com.taskplanner.task_planner.service;

import com.taskplanner.task_planner.dto.AuthDTO;
import com.taskplanner.task_planner.exception.AuthenticationException;
import com.taskplanner.task_planner.model.User;
import com.taskplanner.task_planner.repository.UserRepository;
import com.taskplanner.task_planner.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public String register(AuthDTO request){
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new AuthenticationException("Username already exists");
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
        return jwtService.generateToken(user);
    }

    public String authenticate(AuthDTO request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            return userRepository.findByUsername(request.getUsername())
                .map(jwtService::generateToken)
                .orElseThrow(() -> new AuthenticationException("Invalid credentials"));
                
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Invalid credentials");
        }
    }
}
