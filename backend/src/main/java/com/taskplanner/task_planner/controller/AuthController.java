package com.taskplanner.task_planner.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.taskplanner.task_planner.dto.AuthDTO;
import com.taskplanner.task_planner.service.AuthService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody AuthDTO request){
        return ResponseEntity.ok(new AuthResponseDTO(authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticate(@RequestBody AuthDTO request){
        return ResponseEntity.ok(new AuthResponseDTO(authService.authenticate(request)));
    }
}

record AuthResponseDTO(String token) {}
