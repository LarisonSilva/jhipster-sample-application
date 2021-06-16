package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProdutoEmEstoqueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProdutoEmEstoque.class);
        ProdutoEmEstoque produtoEmEstoque1 = new ProdutoEmEstoque();
        produtoEmEstoque1.setId(1L);
        ProdutoEmEstoque produtoEmEstoque2 = new ProdutoEmEstoque();
        produtoEmEstoque2.setId(produtoEmEstoque1.getId());
        assertThat(produtoEmEstoque1).isEqualTo(produtoEmEstoque2);
        produtoEmEstoque2.setId(2L);
        assertThat(produtoEmEstoque1).isNotEqualTo(produtoEmEstoque2);
        produtoEmEstoque1.setId(null);
        assertThat(produtoEmEstoque1).isNotEqualTo(produtoEmEstoque2);
    }
}
