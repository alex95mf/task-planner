package com.taskplanner.task_planner.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.taskplanner.task_planner.dto.AuthDTO;
import com.taskplanner.task_planner.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {    
    private final AuthService authService;

    @Operation(
        summary = "Register new user",
        description = "Creates a new user account"
    )
    @ApiResponse(
        responseCode = "200",
        description = "User successfully registered"
    )
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(
        @Parameter(description = "User registration details")
        @RequestBody 
        AuthDTO request){
        return ResponseEntity.ok(new AuthResponseDTO(authService.register(request)));
    }

    @Operation(
        summary = "Login user",
        description = "Authenticates a user and returns a JWT token"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Successfully authenticated"
    )
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticate(
        @Parameter(description = "User login details")
        @RequestBody 
        AuthDTO request){
        return ResponseEntity.ok(new AuthResponseDTO(authService.authenticate(request)));
    }
}

record AuthResponseDTO(String token) {}
