package itmo.market.auth.dto

data class LoginRequest(
    val username: String,
    val password: String
)