
package itmo.market.model

import java.time.Instant
import jakarta.persistence.*
@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val username: String,

    @Column(nullable = false)
    val password: String,

    @Column(nullable = false)
    val first_name: String,   // <--- Add this
    @Column(nullable = false)
    val last_name: String,    // <--- And this

    @Column(nullable = false, unique = true)
    val email: String,

    val phone: String? = null,

    val status: String = "ACTIVE",

    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
)
