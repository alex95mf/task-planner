package com.taskplanner.task_planner.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.taskplanner.task_planner.dto.AuthDTO;
import com.taskplanner.task_planner.model.User;
import com.taskplanner.task_planner.repository.UserRepository;
import com.taskplanner.task_planner.security.JwtService;
import com.taskplanner.task_planner.exception.AuthenticationException;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private AuthDTO authDTO;
    private User user;

    @BeforeEach
    void setUp() {
        authDTO = new AuthDTO();
        authDTO.setUsername("testuser");
        authDTO.setPassword("password");

        user = new User();
        user.setId("1");
        user.setUsername("testuser");
        user.setPassword("encodedPassword");
    }

    @Test
    void register_WithNewUser_ShouldReturnToken() {
        // Arrange
        when(userRepository.findByUsername(authDTO.getUsername())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(authDTO.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(User.class))).thenReturn("token");

        // Act
        String result = authService.register(authDTO);

        // Assert
        assertNotNull(result);
        assertEquals("token", result);
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken(any(User.class));
    }

    @Test
    void register_WithExistingUsername_ShouldThrowException() {
        // Arrange
        when(userRepository.findByUsername(authDTO.getUsername())).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(AuthenticationException.class, () -> {
            authService.register(authDTO);
        });
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void authenticate_WithValidCredentials_ShouldReturnToken() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(new UsernamePasswordAuthenticationToken(authDTO.getUsername(), authDTO.getPassword()));
        when(userRepository.findByUsername(authDTO.getUsername())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("token");

        // Act
        String result = authService.authenticate(authDTO);

        // Assert
        assertNotNull(result);
        assertEquals("token", result);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService).generateToken(user);
    }

    @Test
    void authenticate_WithInvalidCredentials_ShouldThrowException() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        assertThrows(AuthenticationException.class, () -> {
            authService.authenticate(authDTO);
        });
        verify(jwtService, never()).generateToken(any(User.class));
    }
}
