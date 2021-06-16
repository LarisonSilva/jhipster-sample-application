package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ProdutoNoPedido;
import com.mycompany.myapp.repository.ProdutoNoPedidoRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProdutoNoPedidoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProdutoNoPedidoResourceIT {

    private static final Integer DEFAULT_QUANTIDADE = 1;
    private static final Integer UPDATED_QUANTIDADE = 2;

    private static final Double DEFAULT_PRECO = 1D;
    private static final Double UPDATED_PRECO = 2D;

    private static final ZonedDateTime DEFAULT_CRIADO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CRIADO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/produto-no-pedidos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProdutoNoPedidoRepository produtoNoPedidoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProdutoNoPedidoMockMvc;

    private ProdutoNoPedido produtoNoPedido;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProdutoNoPedido createEntity(EntityManager em) {
        ProdutoNoPedido produtoNoPedido = new ProdutoNoPedido().quantidade(DEFAULT_QUANTIDADE).preco(DEFAULT_PRECO).criado(DEFAULT_CRIADO);
        return produtoNoPedido;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProdutoNoPedido createUpdatedEntity(EntityManager em) {
        ProdutoNoPedido produtoNoPedido = new ProdutoNoPedido().quantidade(UPDATED_QUANTIDADE).preco(UPDATED_PRECO).criado(UPDATED_CRIADO);
        return produtoNoPedido;
    }

    @BeforeEach
    public void initTest() {
        produtoNoPedido = createEntity(em);
    }

    @Test
    @Transactional
    void createProdutoNoPedido() throws Exception {
        int databaseSizeBeforeCreate = produtoNoPedidoRepository.findAll().size();
        // Create the ProdutoNoPedido
        restProdutoNoPedidoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoNoPedido))
            )
            .andExpect(status().isCreated());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeCreate + 1);
        ProdutoNoPedido testProdutoNoPedido = produtoNoPedidoList.get(produtoNoPedidoList.size() - 1);
        assertThat(testProdutoNoPedido.getQuantidade()).isEqualTo(DEFAULT_QUANTIDADE);
        assertThat(testProdutoNoPedido.getPreco()).isEqualTo(DEFAULT_PRECO);
        assertThat(testProdutoNoPedido.getCriado()).isEqualTo(DEFAULT_CRIADO);
    }

    @Test
    @Transactional
    void createProdutoNoPedidoWithExistingId() throws Exception {
        // Create the ProdutoNoPedido with an existing ID
        produtoNoPedido.setId(1L);

        int databaseSizeBeforeCreate = produtoNoPedidoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProdutoNoPedidoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoNoPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProdutoNoPedidos() throws Exception {
        // Initialize the database
        produtoNoPedidoRepository.saveAndFlush(produtoNoPedido);

        // Get all the produtoNoPedidoList
        restProdutoNoPedidoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(produtoNoPedido.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantidade").value(hasItem(DEFAULT_QUANTIDADE)))
            .andExpect(jsonPath("$.[*].preco").value(hasItem(DEFAULT_PRECO.doubleValue())))
            .andExpect(jsonPath("$.[*].criado").value(hasItem(sameInstant(DEFAULT_CRIADO))));
    }

    @Test
    @Transactional
    void getProdutoNoPedido() throws Exception {
        // Initialize the database
        produtoNoPedidoRepository.saveAndFlush(produtoNoPedido);

        // Get the produtoNoPedido
        restProdutoNoPedidoMockMvc
            .perform(get(ENTITY_API_URL_ID, produtoNoPedido.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(produtoNoPedido.getId().intValue()))
            .andExpect(jsonPath("$.quantidade").value(DEFAULT_QUANTIDADE))
            .andExpect(jsonPath("$.preco").value(DEFAULT_PRECO.doubleValue()))
            .andExpect(jsonPath("$.criado").value(sameInstant(DEFAULT_CRIADO)));
    }

    @Test
    @Transactional
    void getNonExistingProdutoNoPedido() throws Exception {
        // Get the produtoNoPedido
        restProdutoNoPedidoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProdutoNoPedido() throws Exception {
        // Initialize the database
        produtoNoPedidoRepository.saveAndFlush(produtoNoPedido);

        int databaseSizeBeforeUpdate = produtoNoPedidoRepository.findAll().size();

        // Update the produtoNoPedido
        ProdutoNoPedido updatedProdutoNoPedido = produtoNoPedidoRepository.findById(produtoNoPedido.getId()).get();
        // Disconnect from session so that the updates on updatedProdutoNoPedido are not directly saved in db
        em.detach(updatedProdutoNoPedido);
        updatedProdutoNoPedido.quantidade(UPDATED_QUANTIDADE).preco(UPDATED_PRECO).criado(UPDATED_CRIADO);

        restProdutoNoPedidoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProdutoNoPedido.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProdutoNoPedido))
            )
            .andExpect(status().isOk());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeUpdate);
        ProdutoNoPedido testProdutoNoPedido = produtoNoPedidoList.get(produtoNoPedidoList.size() - 1);
        assertThat(testProdutoNoPedido.getQuantidade()).isEqualTo(UPDATED_QUANTIDADE);
        assertThat(testProdutoNoPedido.getPreco()).isEqualTo(UPDATED_PRECO);
        assertThat(testProdutoNoPedido.getCriado()).isEqualTo(UPDATED_CRIADO);
    }

    @Test
    @Transactional
    void putNonExistingProdutoNoPedido() throws Exception {
        int databaseSizeBeforeUpdate = produtoNoPedidoRepository.findAll().size();
        produtoNoPedido.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdutoNoPedidoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, produtoNoPedido.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produtoNoPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProdutoNoPedido() throws Exception {
        int databaseSizeBeforeUpdate = produtoNoPedidoRepository.findAll().size();
        produtoNoPedido.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoNoPedidoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produtoNoPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProdutoNoPedido() throws Exception {
        int databaseSizeBeforeUpdate = produtoNoPedidoRepository.findAll().size();
        produtoNoPedido.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoNoPedidoMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoNoPedido))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProdutoNoPedidoWithPatch() throws Exception {
        // Initialize the database
        produtoNoPedidoRepository.saveAndFlush(produtoNoPedido);

        int databaseSizeBeforeUpdate = produtoNoPedidoRepository.findAll().size();

        // Update the produtoNoPedido using partial update
        ProdutoNoPedido partialUpdatedProdutoNoPedido = new ProdutoNoPedido();
        partialUpdatedProdutoNoPedido.setId(produtoNoPedido.getId());

        partialUpdatedProdutoNoPedido.quantidade(UPDATED_QUANTIDADE).criado(UPDATED_CRIADO);

        restProdutoNoPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProdutoNoPedido.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProdutoNoPedido))
            )
            .andExpect(status().isOk());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeUpdate);
        ProdutoNoPedido testProdutoNoPedido = produtoNoPedidoList.get(produtoNoPedidoList.size() - 1);
        assertThat(testProdutoNoPedido.getQuantidade()).isEqualTo(UPDATED_QUANTIDADE);
        assertThat(testProdutoNoPedido.getPreco()).isEqualTo(DEFAULT_PRECO);
        assertThat(testProdutoNoPedido.getCriado()).isEqualTo(UPDATED_CRIADO);
    }

    @Test
    @Transactional
    void fullUpdateProdutoNoPedidoWithPatch() throws Exception {
        // Initialize the database
        produtoNoPedidoRepository.saveAndFlush(produtoNoPedido);

        int databaseSizeBeforeUpdate = produtoNoPedidoRepository.findAll().size();

        // Update the produtoNoPedido using partial update
        ProdutoNoPedido partialUpdatedProdutoNoPedido = new ProdutoNoPedido();
        partialUpdatedProdutoNoPedido.setId(produtoNoPedido.getId());

        partialUpdatedProdutoNoPedido.quantidade(UPDATED_QUANTIDADE).preco(UPDATED_PRECO).criado(UPDATED_CRIADO);

        restProdutoNoPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProdutoNoPedido.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProdutoNoPedido))
            )
            .andExpect(status().isOk());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeUpdate);
        ProdutoNoPedido testProdutoNoPedido = produtoNoPedidoList.get(produtoNoPedidoList.size() - 1);
        assertThat(testProdutoNoPedido.getQuantidade()).isEqualTo(UPDATED_QUANTIDADE);
        assertThat(testProdutoNoPedido.getPreco()).isEqualTo(UPDATED_PRECO);
        assertThat(testProdutoNoPedido.getCriado()).isEqualTo(UPDATED_CRIADO);
    }

    @Test
    @Transactional
    void patchNonExistingProdutoNoPedido() throws Exception {
        int databaseSizeBeforeUpdate = produtoNoPedidoRepository.findAll().size();
        produtoNoPedido.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdutoNoPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, produtoNoPedido.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produtoNoPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProdutoNoPedido() throws Exception {
        int databaseSizeBeforeUpdate = produtoNoPedidoRepository.findAll().size();
        produtoNoPedido.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoNoPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produtoNoPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProdutoNoPedido() throws Exception {
        int databaseSizeBeforeUpdate = produtoNoPedidoRepository.findAll().size();
        produtoNoPedido.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoNoPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produtoNoPedido))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProdutoNoPedido in the database
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProdutoNoPedido() throws Exception {
        // Initialize the database
        produtoNoPedidoRepository.saveAndFlush(produtoNoPedido);

        int databaseSizeBeforeDelete = produtoNoPedidoRepository.findAll().size();

        // Delete the produtoNoPedido
        restProdutoNoPedidoMockMvc
            .perform(delete(ENTITY_API_URL_ID, produtoNoPedido.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProdutoNoPedido> produtoNoPedidoList = produtoNoPedidoRepository.findAll();
        assertThat(produtoNoPedidoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
