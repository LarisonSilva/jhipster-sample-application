package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PerfilUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PerfilUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PerfilUserRepository extends JpaRepository<PerfilUser, Long> {}
