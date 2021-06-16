package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ProdutoEmEstoque;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProdutoEmEstoque entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProdutoEmEstoqueRepository extends JpaRepository<ProdutoEmEstoque, Long> {}
