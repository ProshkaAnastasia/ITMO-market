package itmo.market.auth.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtUtil {

    // ✅ Use a proper key object, not a plain string
    private val SECRET_KEY: SecretKey = Keys.hmacShaKeyFor("very_secret_key_for_demo_purposes_only_12345".toByteArray())

    private val EXPIRATION_MS = 1000 * 60 * 60 // 1 hour

    fun generateToken(username: String): String {
        val now = Date()
        val exp = Date(now.time + EXPIRATION_MS)

        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(now)
            .setExpiration(exp)
            // ✅ new recommended API
            .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
            .compact()
    }

    fun extractUsername(token: String): String? {
        return extractAllClaims(token)?.subject
    }

    fun validateToken(token: String, userDetails: UserDetails): Boolean {
        val username = extractUsername(token)
        return (username == userDetails.username) && !isTokenExpired(token)
    }

    private fun extractAllClaims(token: String): Claims? {
        return try {
            // ✅ modern parser API
            Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .body
        } catch (e: Exception) {
            null
        }
    }

    private fun isTokenExpired(token: String): Boolean {
        val claims = extractAllClaims(token) ?: return true
        return claims.expiration.before(Date())
    }
}
