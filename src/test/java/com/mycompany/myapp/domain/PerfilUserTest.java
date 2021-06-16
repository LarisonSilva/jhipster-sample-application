package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PerfilUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PerfilUser.class);
        PerfilUser perfilUser1 = new PerfilUser();
        perfilUser1.setId(1L);
        PerfilUser perfilUser2 = new PerfilUser();
        perfilUser2.setId(perfilUser1.getId());
        assertThat(perfilUser1).isEqualTo(perfilUser2);
        perfilUser2.setId(2L);
        assertThat(perfilUser1).isNotEqualTo(perfilUser2);
        perfilUser1.setId(null);
        assertThat(perfilUser1).isNotEqualTo(perfilUser2);
    }
}
