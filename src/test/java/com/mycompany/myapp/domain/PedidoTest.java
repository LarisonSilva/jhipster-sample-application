package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PedidoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pedido.class);
        Pedido pedido1 = new Pedido();
        pedido1.setId(1L);
        Pedido pedido2 = new Pedido();
        pedido2.setId(pedido1.getId());
        assertThat(pedido1).isEqualTo(pedido2);
        pedido2.setId(2L);
        assertThat(pedido1).isNotEqualTo(pedido2);
        pedido1.setId(null);
        assertThat(pedido1).isNotEqualTo(pedido2);
    }

    @Test
    void verificarEstoque() throws Exception {

        ProdutoEmEstoque cafe = new ProdutoEmEstoque();
        cafe.setTotalEstoque(10);
        cafe.setNome(
            "Café"
        );
        cafe.setPreco(
            10.0
        );

        
        Pedido pedido1 = new Pedido();

        ProdutoNoPedido pNoPedido = new ProdutoNoPedido();
        pNoPedido.setProdutoEmEstoque(cafe);
        pNoPedido.setQuantidade(10);
        pNoPedido.setPedido(
            pedido1            
        );

        // tem que remover com sucesso
        assertThat(pNoPedido.debitarEstoque()).isTrue();
        
        ProdutoNoPedido pNoPedidoDeNovo = new ProdutoNoPedido();  
        pNoPedidoDeNovo.setProdutoEmEstoque(
            cafe
        );
        pNoPedidoDeNovo.setQuantidade(10);
        //Não pode remover pq ja acabou o estoque antes
        assertThat(pNoPedidoDeNovo.debitarEstoque()).isFalse();
    
    }
}
