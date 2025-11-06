package itmo.market.auth.controller

import itmo.market.auth.dto.LoginRequest
import itmo.market.auth.dto.RegisterRequest
import itmo.market.auth.dto.TokenResponse
import itmo.market.auth.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/login")
    fun login(@RequestBody req: LoginRequest): ResponseEntity<TokenResponse> {
        val tokens = authService.login(req)
        return ResponseEntity.ok(tokens)
    }

    @PostMapping("/register")
    fun register(@RequestBody req: RegisterRequest): ResponseEntity<TokenResponse> {
        val tokens = authService.register(req)
        return ResponseEntity.ok(tokens)
    }

    @PostMapping("/refresh_token")
    fun refresh(@RequestBody body: Map<String, String>): ResponseEntity<TokenResponse> {
        val refresh = body["refreshToken"] ?: throw IllegalArgumentException("refreshToken required")
        val tokens = authService.refresh(refresh)
        return ResponseEntity.ok(tokens)
    }
}