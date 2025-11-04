package itmo.market.auth.service

import itmo.market.auth.dto.LoginRequest
import itmo.market.auth.dto.RegisterRequest
import itmo.market.auth.dto.TokenResponse
import itmo.market.model.RefreshToken
import itmo.market.model.User
import itmo.market.repository.RefreshTokenRepository
import itmo.market.repository.UserRepository
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.*

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil,
    private val authenticationManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService
) {

    fun register(req: RegisterRequest): TokenResponse {
        if (userRepository.existsByUsername(req.username)) {
            throw IllegalArgumentException("Username already exists")
        }

        val user = User(
            username = req.username,
            password = passwordEncoder.encode(req.password),
            first_name = req.first_name,
            last_name = req.last_name,
            email = req.email
        )
        userRepository.save(user)


        val access = jwtUtil.generateToken(user.username)
        val refresh = createRefreshToken(user)
        return TokenResponse(accessToken = access, refreshToken = refresh)
    }

    // fun login(req: LoginRequest): TokenResponse {
    //     val authToken = UsernamePasswordAuthenticationToken(req.username, req.password)
    //     authenticationManager.authenticate(authToken)

    //     val access = jwtUtil.generateToken(req.username)
    //     val user = userRepository.findByUsername(req.username)
    //         ?: throw IllegalArgumentException("User not found")
    //     val refresh = createRefreshToken(user)
    //     return TokenResponse(accessToken = access, refreshToken = refresh)
    // }


    fun login(req: LoginRequest): TokenResponse {
        val authToken = UsernamePasswordAuthenticationToken(req.username, req.password)
        authenticationManager.authenticate(authToken)

        val user = userRepository.findByUsername(req.username)
            ?: throw IllegalArgumentException("User not found")

        // *************** FIX IMPLEMENTED HERE ***************
        // 3. Before creating a new refresh token, find and delete any existing token for this user.
        // This ensures the 1-user-to-1-token relationship is maintained.
        refreshTokenRepository.findByUser(user)?.let { existingToken ->
            refreshTokenRepository.delete(existingToken)
        }

        val access = jwtUtil.generateToken(req.username)
        val refresh = createRefreshToken(user) // This function creates and saves the new token
        return TokenResponse(accessToken = access, refreshToken = refresh)
    }

    fun refresh(refreshToken: String): TokenResponse {
        val token = refreshTokenRepository.findByToken(refreshToken)
            ?: throw IllegalArgumentException("Invalid refresh token")
        if (token.expiry.isBefore(Instant.now())) {
            refreshTokenRepository.delete(token)
            throw IllegalArgumentException("Refresh token expired")
        }

        val access = jwtUtil.generateToken(token.user.username)
        val newRefresh = createRefreshToken(token.user)
        // delete old one
        refreshTokenRepository.delete(token)
        println(token)
        println(newRefresh)

        return TokenResponse(accessToken = access, refreshToken = newRefresh)
    }

    private fun createRefreshToken(user: User): String {
        val token = UUID.randomUUID().toString()
        val expiry = Instant.now().plusSeconds(60 * 60 * 24 * 30) // 30 days
        val r = RefreshToken(token = token, user = user, expiry = expiry)
        refreshTokenRepository.save(r)
        return token
    }
}