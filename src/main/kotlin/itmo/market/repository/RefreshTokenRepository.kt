

package itmo.market.repository

import itmo.market.model.RefreshToken
import itmo.market.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


@Repository
interface RefreshTokenRepository : JpaRepository<RefreshToken, Long> {
    fun findByToken(token: String): RefreshToken?
    fun findByUser(user: User): RefreshToken?
}