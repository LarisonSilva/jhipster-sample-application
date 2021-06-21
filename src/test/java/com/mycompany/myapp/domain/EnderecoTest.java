package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EnderecoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Endereco.class);
        Endereco endereco1 = new Endereco();
        endereco1.setId(1L);
        Endereco endereco2 = new Endereco();
        endereco2.setId(endereco1.getId());
        assertThat(endereco1).isEqualTo(endereco2);
        endereco2.setId(2L);
        assertThat(endereco1).isNotEqualTo(endereco2);
        endereco1.setId(null);
        assertThat(endereco1).isNotEqualTo(endereco2);
    }
    @Test
    void verificarEndereco() throws Exception{
        Endereco logradouroTest = new  Endereco();
        logradouroTest.setLogradouro("casa1");

        Endereco logradouroTest2 = new  Endereco();
        logradouroTest2.setId(null);

        assertThat(logradouroTest2).isNotEqualTo(logradouroTest);
    }
}
