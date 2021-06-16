package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ProdutoEmEstoque;
import com.mycompany.myapp.repository.ProdutoEmEstoqueRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ProdutoEmEstoqueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProdutoEmEstoqueResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String DEFAULT_FOTO_URL = "AAAAAAAAAA";
    private static final String UPDATED_FOTO_URL = "BBBBBBBBBB";

    private static final String DEFAULT_SKU = "AAAAAAAAAA";
    private static final String UPDATED_SKU = "BBBBBBBBBB";

    private static final String DEFAULT_EAN = "AAAAAAAAAA";
    private static final String UPDATED_EAN = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CRIADO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CRIADO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_PRECO = 1D;
    private static final Double UPDATED_PRECO = 2D;

    private static final Double DEFAULT_PRECO_PROMOCIONAL = 1D;
    private static final Double UPDATED_PRECO_PROMOCIONAL = 2D;

    private static final Integer DEFAULT_TOTAL_ESTOQUE = 1;
    private static final Integer UPDATED_TOTAL_ESTOQUE = 2;

    private static final String ENTITY_API_URL = "/api/produto-em-estoques";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProdutoEmEstoqueRepository produtoEmEstoqueRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProdutoEmEstoqueMockMvc;

    private ProdutoEmEstoque produtoEmEstoque;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProdutoEmEstoque createEntity(EntityManager em) {
        ProdutoEmEstoque produtoEmEstoque = new ProdutoEmEstoque()
            .nome(DEFAULT_NOME)
            .descricao(DEFAULT_DESCRICAO)
            .fotoUrl(DEFAULT_FOTO_URL)
            .sku(DEFAULT_SKU)
            .ean(DEFAULT_EAN)
            .criado(DEFAULT_CRIADO)
            .preco(DEFAULT_PRECO)
            .precoPromocional(DEFAULT_PRECO_PROMOCIONAL)
            .totalEstoque(DEFAULT_TOTAL_ESTOQUE);
        return produtoEmEstoque;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProdutoEmEstoque createUpdatedEntity(EntityManager em) {
        ProdutoEmEstoque produtoEmEstoque = new ProdutoEmEstoque()
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .fotoUrl(UPDATED_FOTO_URL)
            .sku(UPDATED_SKU)
            .ean(UPDATED_EAN)
            .criado(UPDATED_CRIADO)
            .preco(UPDATED_PRECO)
            .precoPromocional(UPDATED_PRECO_PROMOCIONAL)
            .totalEstoque(UPDATED_TOTAL_ESTOQUE);
        return produtoEmEstoque;
    }

    @BeforeEach
    public void initTest() {
        produtoEmEstoque = createEntity(em);
    }

    @Test
    @Transactional
    void createProdutoEmEstoque() throws Exception {
        int databaseSizeBeforeCreate = produtoEmEstoqueRepository.findAll().size();
        // Create the ProdutoEmEstoque
        restProdutoEmEstoqueMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoEmEstoque))
            )
            .andExpect(status().isCreated());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeCreate + 1);
        ProdutoEmEstoque testProdutoEmEstoque = produtoEmEstoqueList.get(produtoEmEstoqueList.size() - 1);
        assertThat(testProdutoEmEstoque.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testProdutoEmEstoque.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testProdutoEmEstoque.getFotoUrl()).isEqualTo(DEFAULT_FOTO_URL);
        assertThat(testProdutoEmEstoque.getSku()).isEqualTo(DEFAULT_SKU);
        assertThat(testProdutoEmEstoque.getEan()).isEqualTo(DEFAULT_EAN);
        assertThat(testProdutoEmEstoque.getCriado()).isEqualTo(DEFAULT_CRIADO);
        assertThat(testProdutoEmEstoque.getPreco()).isEqualTo(DEFAULT_PRECO);
        assertThat(testProdutoEmEstoque.getPrecoPromocional()).isEqualTo(DEFAULT_PRECO_PROMOCIONAL);
        assertThat(testProdutoEmEstoque.getTotalEstoque()).isEqualTo(DEFAULT_TOTAL_ESTOQUE);
    }

    @Test
    @Transactional
    void createProdutoEmEstoqueWithExistingId() throws Exception {
        // Create the ProdutoEmEstoque with an existing ID
        produtoEmEstoque.setId(1L);

        int databaseSizeBeforeCreate = produtoEmEstoqueRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProdutoEmEstoqueMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoEmEstoque))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = produtoEmEstoqueRepository.findAll().size();
        // set the field null
        produtoEmEstoque.setNome(null);

        // Create the ProdutoEmEstoque, which fails.

        restProdutoEmEstoqueMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoEmEstoque))
            )
            .andExpect(status().isBadRequest());

        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProdutoEmEstoques() throws Exception {
        // Initialize the database
        produtoEmEstoqueRepository.saveAndFlush(produtoEmEstoque);

        // Get all the produtoEmEstoqueList
        restProdutoEmEstoqueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(produtoEmEstoque.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO.toString())))
            .andExpect(jsonPath("$.[*].fotoUrl").value(hasItem(DEFAULT_FOTO_URL)))
            .andExpect(jsonPath("$.[*].sku").value(hasItem(DEFAULT_SKU)))
            .andExpect(jsonPath("$.[*].ean").value(hasItem(DEFAULT_EAN)))
            .andExpect(jsonPath("$.[*].criado").value(hasItem(sameInstant(DEFAULT_CRIADO))))
            .andExpect(jsonPath("$.[*].preco").value(hasItem(DEFAULT_PRECO.doubleValue())))
            .andExpect(jsonPath("$.[*].precoPromocional").value(hasItem(DEFAULT_PRECO_PROMOCIONAL.doubleValue())))
            .andExpect(jsonPath("$.[*].totalEstoque").value(hasItem(DEFAULT_TOTAL_ESTOQUE)));
    }

    @Test
    @Transactional
    void getProdutoEmEstoque() throws Exception {
        // Initialize the database
        produtoEmEstoqueRepository.saveAndFlush(produtoEmEstoque);

        // Get the produtoEmEstoque
        restProdutoEmEstoqueMockMvc
            .perform(get(ENTITY_API_URL_ID, produtoEmEstoque.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(produtoEmEstoque.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO.toString()))
            .andExpect(jsonPath("$.fotoUrl").value(DEFAULT_FOTO_URL))
            .andExpect(jsonPath("$.sku").value(DEFAULT_SKU))
            .andExpect(jsonPath("$.ean").value(DEFAULT_EAN))
            .andExpect(jsonPath("$.criado").value(sameInstant(DEFAULT_CRIADO)))
            .andExpect(jsonPath("$.preco").value(DEFAULT_PRECO.doubleValue()))
            .andExpect(jsonPath("$.precoPromocional").value(DEFAULT_PRECO_PROMOCIONAL.doubleValue()))
            .andExpect(jsonPath("$.totalEstoque").value(DEFAULT_TOTAL_ESTOQUE));
    }

    @Test
    @Transactional
    void getNonExistingProdutoEmEstoque() throws Exception {
        // Get the produtoEmEstoque
        restProdutoEmEstoqueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProdutoEmEstoque() throws Exception {
        // Initialize the database
        produtoEmEstoqueRepository.saveAndFlush(produtoEmEstoque);

        int databaseSizeBeforeUpdate = produtoEmEstoqueRepository.findAll().size();

        // Update the produtoEmEstoque
        ProdutoEmEstoque updatedProdutoEmEstoque = produtoEmEstoqueRepository.findById(produtoEmEstoque.getId()).get();
        // Disconnect from session so that the updates on updatedProdutoEmEstoque are not directly saved in db
        em.detach(updatedProdutoEmEstoque);
        updatedProdutoEmEstoque
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .fotoUrl(UPDATED_FOTO_URL)
            .sku(UPDATED_SKU)
            .ean(UPDATED_EAN)
            .criado(UPDATED_CRIADO)
            .preco(UPDATED_PRECO)
            .precoPromocional(UPDATED_PRECO_PROMOCIONAL)
            .totalEstoque(UPDATED_TOTAL_ESTOQUE);

        restProdutoEmEstoqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProdutoEmEstoque.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProdutoEmEstoque))
            )
            .andExpect(status().isOk());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeUpdate);
        ProdutoEmEstoque testProdutoEmEstoque = produtoEmEstoqueList.get(produtoEmEstoqueList.size() - 1);
        assertThat(testProdutoEmEstoque.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testProdutoEmEstoque.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testProdutoEmEstoque.getFotoUrl()).isEqualTo(UPDATED_FOTO_URL);
        assertThat(testProdutoEmEstoque.getSku()).isEqualTo(UPDATED_SKU);
        assertThat(testProdutoEmEstoque.getEan()).isEqualTo(UPDATED_EAN);
        assertThat(testProdutoEmEstoque.getCriado()).isEqualTo(UPDATED_CRIADO);
        assertThat(testProdutoEmEstoque.getPreco()).isEqualTo(UPDATED_PRECO);
        assertThat(testProdutoEmEstoque.getPrecoPromocional()).isEqualTo(UPDATED_PRECO_PROMOCIONAL);
        assertThat(testProdutoEmEstoque.getTotalEstoque()).isEqualTo(UPDATED_TOTAL_ESTOQUE);
    }

    @Test
    @Transactional
    void putNonExistingProdutoEmEstoque() throws Exception {
        int databaseSizeBeforeUpdate = produtoEmEstoqueRepository.findAll().size();
        produtoEmEstoque.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdutoEmEstoqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, produtoEmEstoque.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produtoEmEstoque))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProdutoEmEstoque() throws Exception {
        int databaseSizeBeforeUpdate = produtoEmEstoqueRepository.findAll().size();
        produtoEmEstoque.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoEmEstoqueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produtoEmEstoque))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProdutoEmEstoque() throws Exception {
        int databaseSizeBeforeUpdate = produtoEmEstoqueRepository.findAll().size();
        produtoEmEstoque.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoEmEstoqueMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produtoEmEstoque))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProdutoEmEstoqueWithPatch() throws Exception {
        // Initialize the database
        produtoEmEstoqueRepository.saveAndFlush(produtoEmEstoque);

        int databaseSizeBeforeUpdate = produtoEmEstoqueRepository.findAll().size();

        // Update the produtoEmEstoque using partial update
        ProdutoEmEstoque partialUpdatedProdutoEmEstoque = new ProdutoEmEstoque();
        partialUpdatedProdutoEmEstoque.setId(produtoEmEstoque.getId());

        partialUpdatedProdutoEmEstoque
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .fotoUrl(UPDATED_FOTO_URL)
            .sku(UPDATED_SKU)
            .ean(UPDATED_EAN)
            .criado(UPDATED_CRIADO)
            .preco(UPDATED_PRECO)
            .precoPromocional(UPDATED_PRECO_PROMOCIONAL);

        restProdutoEmEstoqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProdutoEmEstoque.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProdutoEmEstoque))
            )
            .andExpect(status().isOk());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeUpdate);
        ProdutoEmEstoque testProdutoEmEstoque = produtoEmEstoqueList.get(produtoEmEstoqueList.size() - 1);
        assertThat(testProdutoEmEstoque.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testProdutoEmEstoque.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testProdutoEmEstoque.getFotoUrl()).isEqualTo(UPDATED_FOTO_URL);
        assertThat(testProdutoEmEstoque.getSku()).isEqualTo(UPDATED_SKU);
        assertThat(testProdutoEmEstoque.getEan()).isEqualTo(UPDATED_EAN);
        assertThat(testProdutoEmEstoque.getCriado()).isEqualTo(UPDATED_CRIADO);
        assertThat(testProdutoEmEstoque.getPreco()).isEqualTo(UPDATED_PRECO);
        assertThat(testProdutoEmEstoque.getPrecoPromocional()).isEqualTo(UPDATED_PRECO_PROMOCIONAL);
        assertThat(testProdutoEmEstoque.getTotalEstoque()).isEqualTo(DEFAULT_TOTAL_ESTOQUE);
    }

    @Test
    @Transactional
    void fullUpdateProdutoEmEstoqueWithPatch() throws Exception {
        // Initialize the database
        produtoEmEstoqueRepository.saveAndFlush(produtoEmEstoque);

        int databaseSizeBeforeUpdate = produtoEmEstoqueRepository.findAll().size();

        // Update the produtoEmEstoque using partial update
        ProdutoEmEstoque partialUpdatedProdutoEmEstoque = new ProdutoEmEstoque();
        partialUpdatedProdutoEmEstoque.setId(produtoEmEstoque.getId());

        partialUpdatedProdutoEmEstoque
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .fotoUrl(UPDATED_FOTO_URL)
            .sku(UPDATED_SKU)
            .ean(UPDATED_EAN)
            .criado(UPDATED_CRIADO)
            .preco(UPDATED_PRECO)
            .precoPromocional(UPDATED_PRECO_PROMOCIONAL)
            .totalEstoque(UPDATED_TOTAL_ESTOQUE);

        restProdutoEmEstoqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProdutoEmEstoque.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProdutoEmEstoque))
            )
            .andExpect(status().isOk());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeUpdate);
        ProdutoEmEstoque testProdutoEmEstoque = produtoEmEstoqueList.get(produtoEmEstoqueList.size() - 1);
        assertThat(testProdutoEmEstoque.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testProdutoEmEstoque.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testProdutoEmEstoque.getFotoUrl()).isEqualTo(UPDATED_FOTO_URL);
        assertThat(testProdutoEmEstoque.getSku()).isEqualTo(UPDATED_SKU);
        assertThat(testProdutoEmEstoque.getEan()).isEqualTo(UPDATED_EAN);
        assertThat(testProdutoEmEstoque.getCriado()).isEqualTo(UPDATED_CRIADO);
        assertThat(testProdutoEmEstoque.getPreco()).isEqualTo(UPDATED_PRECO);
        assertThat(testProdutoEmEstoque.getPrecoPromocional()).isEqualTo(UPDATED_PRECO_PROMOCIONAL);
        assertThat(testProdutoEmEstoque.getTotalEstoque()).isEqualTo(UPDATED_TOTAL_ESTOQUE);
    }

    @Test
    @Transactional
    void patchNonExistingProdutoEmEstoque() throws Exception {
        int databaseSizeBeforeUpdate = produtoEmEstoqueRepository.findAll().size();
        produtoEmEstoque.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdutoEmEstoqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, produtoEmEstoque.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produtoEmEstoque))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProdutoEmEstoque() throws Exception {
        int databaseSizeBeforeUpdate = produtoEmEstoqueRepository.findAll().size();
        produtoEmEstoque.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoEmEstoqueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produtoEmEstoque))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProdutoEmEstoque() throws Exception {
        int databaseSizeBeforeUpdate = produtoEmEstoqueRepository.findAll().size();
        produtoEmEstoque.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoEmEstoqueMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produtoEmEstoque))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProdutoEmEstoque in the database
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProdutoEmEstoque() throws Exception {
        // Initialize the database
        produtoEmEstoqueRepository.saveAndFlush(produtoEmEstoque);

        int databaseSizeBeforeDelete = produtoEmEstoqueRepository.findAll().size();

        // Delete the produtoEmEstoque
        restProdutoEmEstoqueMockMvc
            .perform(delete(ENTITY_API_URL_ID, produtoEmEstoque.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProdutoEmEstoque> produtoEmEstoqueList = produtoEmEstoqueRepository.findAll();
        assertThat(produtoEmEstoqueList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
