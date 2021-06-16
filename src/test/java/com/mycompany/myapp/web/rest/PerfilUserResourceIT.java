package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.PerfilUser;
import com.mycompany.myapp.repository.PerfilUserRepository;
import java.time.Instant;
import java.time.LocalDate;
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
 * Integration tests for the {@link PerfilUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PerfilUserResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_SENHA = "AAAAAAAAAA";
    private static final String UPDATED_SENHA = "BBBBBBBBBB";

    private static final String DEFAULT_FOTO_URL = "AAAAAAAAAA";
    private static final String UPDATED_FOTO_URL = "BBBBBBBBBB";

    private static final String DEFAULT_CPF = "AAAAAAAAAA";
    private static final String UPDATED_CPF = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_NASCIMENTO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_NASCIMENTO = LocalDate.now(ZoneId.systemDefault());

    private static final ZonedDateTime DEFAULT_CRIADO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CRIADO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_CONTATO = "AAAAAAAAAA";
    private static final String UPDATED_CONTATO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/perfil-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PerfilUserRepository perfilUserRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPerfilUserMockMvc;

    private PerfilUser perfilUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PerfilUser createEntity(EntityManager em) {
        PerfilUser perfilUser = new PerfilUser()
            .nome(DEFAULT_NOME)
            .senha(DEFAULT_SENHA)
            .fotoUrl(DEFAULT_FOTO_URL)
            .cpf(DEFAULT_CPF)
            .dataNascimento(DEFAULT_DATA_NASCIMENTO)
            .criado(DEFAULT_CRIADO)
            .email(DEFAULT_EMAIL)
            .contato(DEFAULT_CONTATO);
        return perfilUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PerfilUser createUpdatedEntity(EntityManager em) {
        PerfilUser perfilUser = new PerfilUser()
            .nome(UPDATED_NOME)
            .senha(UPDATED_SENHA)
            .fotoUrl(UPDATED_FOTO_URL)
            .cpf(UPDATED_CPF)
            .dataNascimento(UPDATED_DATA_NASCIMENTO)
            .criado(UPDATED_CRIADO)
            .email(UPDATED_EMAIL)
            .contato(UPDATED_CONTATO);
        return perfilUser;
    }

    @BeforeEach
    public void initTest() {
        perfilUser = createEntity(em);
    }

    @Test
    @Transactional
    void createPerfilUser() throws Exception {
        int databaseSizeBeforeCreate = perfilUserRepository.findAll().size();
        // Create the PerfilUser
        restPerfilUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(perfilUser)))
            .andExpect(status().isCreated());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeCreate + 1);
        PerfilUser testPerfilUser = perfilUserList.get(perfilUserList.size() - 1);
        assertThat(testPerfilUser.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testPerfilUser.getSenha()).isEqualTo(DEFAULT_SENHA);
        assertThat(testPerfilUser.getFotoUrl()).isEqualTo(DEFAULT_FOTO_URL);
        assertThat(testPerfilUser.getCpf()).isEqualTo(DEFAULT_CPF);
        assertThat(testPerfilUser.getDataNascimento()).isEqualTo(DEFAULT_DATA_NASCIMENTO);
        assertThat(testPerfilUser.getCriado()).isEqualTo(DEFAULT_CRIADO);
        assertThat(testPerfilUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testPerfilUser.getContato()).isEqualTo(DEFAULT_CONTATO);
    }

    @Test
    @Transactional
    void createPerfilUserWithExistingId() throws Exception {
        // Create the PerfilUser with an existing ID
        perfilUser.setId(1L);

        int databaseSizeBeforeCreate = perfilUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPerfilUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(perfilUser)))
            .andExpect(status().isBadRequest());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = perfilUserRepository.findAll().size();
        // set the field null
        perfilUser.setNome(null);

        // Create the PerfilUser, which fails.

        restPerfilUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(perfilUser)))
            .andExpect(status().isBadRequest());

        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSenhaIsRequired() throws Exception {
        int databaseSizeBeforeTest = perfilUserRepository.findAll().size();
        // set the field null
        perfilUser.setSenha(null);

        // Create the PerfilUser, which fails.

        restPerfilUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(perfilUser)))
            .andExpect(status().isBadRequest());

        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPerfilUsers() throws Exception {
        // Initialize the database
        perfilUserRepository.saveAndFlush(perfilUser);

        // Get all the perfilUserList
        restPerfilUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(perfilUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].senha").value(hasItem(DEFAULT_SENHA)))
            .andExpect(jsonPath("$.[*].fotoUrl").value(hasItem(DEFAULT_FOTO_URL)))
            .andExpect(jsonPath("$.[*].cpf").value(hasItem(DEFAULT_CPF)))
            .andExpect(jsonPath("$.[*].dataNascimento").value(hasItem(DEFAULT_DATA_NASCIMENTO.toString())))
            .andExpect(jsonPath("$.[*].criado").value(hasItem(sameInstant(DEFAULT_CRIADO))))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].contato").value(hasItem(DEFAULT_CONTATO)));
    }

    @Test
    @Transactional
    void getPerfilUser() throws Exception {
        // Initialize the database
        perfilUserRepository.saveAndFlush(perfilUser);

        // Get the perfilUser
        restPerfilUserMockMvc
            .perform(get(ENTITY_API_URL_ID, perfilUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(perfilUser.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.senha").value(DEFAULT_SENHA))
            .andExpect(jsonPath("$.fotoUrl").value(DEFAULT_FOTO_URL))
            .andExpect(jsonPath("$.cpf").value(DEFAULT_CPF))
            .andExpect(jsonPath("$.dataNascimento").value(DEFAULT_DATA_NASCIMENTO.toString()))
            .andExpect(jsonPath("$.criado").value(sameInstant(DEFAULT_CRIADO)))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.contato").value(DEFAULT_CONTATO));
    }

    @Test
    @Transactional
    void getNonExistingPerfilUser() throws Exception {
        // Get the perfilUser
        restPerfilUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPerfilUser() throws Exception {
        // Initialize the database
        perfilUserRepository.saveAndFlush(perfilUser);

        int databaseSizeBeforeUpdate = perfilUserRepository.findAll().size();

        // Update the perfilUser
        PerfilUser updatedPerfilUser = perfilUserRepository.findById(perfilUser.getId()).get();
        // Disconnect from session so that the updates on updatedPerfilUser are not directly saved in db
        em.detach(updatedPerfilUser);
        updatedPerfilUser
            .nome(UPDATED_NOME)
            .senha(UPDATED_SENHA)
            .fotoUrl(UPDATED_FOTO_URL)
            .cpf(UPDATED_CPF)
            .dataNascimento(UPDATED_DATA_NASCIMENTO)
            .criado(UPDATED_CRIADO)
            .email(UPDATED_EMAIL)
            .contato(UPDATED_CONTATO);

        restPerfilUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPerfilUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPerfilUser))
            )
            .andExpect(status().isOk());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeUpdate);
        PerfilUser testPerfilUser = perfilUserList.get(perfilUserList.size() - 1);
        assertThat(testPerfilUser.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testPerfilUser.getSenha()).isEqualTo(UPDATED_SENHA);
        assertThat(testPerfilUser.getFotoUrl()).isEqualTo(UPDATED_FOTO_URL);
        assertThat(testPerfilUser.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testPerfilUser.getDataNascimento()).isEqualTo(UPDATED_DATA_NASCIMENTO);
        assertThat(testPerfilUser.getCriado()).isEqualTo(UPDATED_CRIADO);
        assertThat(testPerfilUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testPerfilUser.getContato()).isEqualTo(UPDATED_CONTATO);
    }

    @Test
    @Transactional
    void putNonExistingPerfilUser() throws Exception {
        int databaseSizeBeforeUpdate = perfilUserRepository.findAll().size();
        perfilUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPerfilUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, perfilUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(perfilUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPerfilUser() throws Exception {
        int databaseSizeBeforeUpdate = perfilUserRepository.findAll().size();
        perfilUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(perfilUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPerfilUser() throws Exception {
        int databaseSizeBeforeUpdate = perfilUserRepository.findAll().size();
        perfilUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(perfilUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePerfilUserWithPatch() throws Exception {
        // Initialize the database
        perfilUserRepository.saveAndFlush(perfilUser);

        int databaseSizeBeforeUpdate = perfilUserRepository.findAll().size();

        // Update the perfilUser using partial update
        PerfilUser partialUpdatedPerfilUser = new PerfilUser();
        partialUpdatedPerfilUser.setId(perfilUser.getId());

        partialUpdatedPerfilUser.nome(UPDATED_NOME).senha(UPDATED_SENHA).fotoUrl(UPDATED_FOTO_URL).cpf(UPDATED_CPF);

        restPerfilUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPerfilUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPerfilUser))
            )
            .andExpect(status().isOk());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeUpdate);
        PerfilUser testPerfilUser = perfilUserList.get(perfilUserList.size() - 1);
        assertThat(testPerfilUser.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testPerfilUser.getSenha()).isEqualTo(UPDATED_SENHA);
        assertThat(testPerfilUser.getFotoUrl()).isEqualTo(UPDATED_FOTO_URL);
        assertThat(testPerfilUser.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testPerfilUser.getDataNascimento()).isEqualTo(DEFAULT_DATA_NASCIMENTO);
        assertThat(testPerfilUser.getCriado()).isEqualTo(DEFAULT_CRIADO);
        assertThat(testPerfilUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testPerfilUser.getContato()).isEqualTo(DEFAULT_CONTATO);
    }

    @Test
    @Transactional
    void fullUpdatePerfilUserWithPatch() throws Exception {
        // Initialize the database
        perfilUserRepository.saveAndFlush(perfilUser);

        int databaseSizeBeforeUpdate = perfilUserRepository.findAll().size();

        // Update the perfilUser using partial update
        PerfilUser partialUpdatedPerfilUser = new PerfilUser();
        partialUpdatedPerfilUser.setId(perfilUser.getId());

        partialUpdatedPerfilUser
            .nome(UPDATED_NOME)
            .senha(UPDATED_SENHA)
            .fotoUrl(UPDATED_FOTO_URL)
            .cpf(UPDATED_CPF)
            .dataNascimento(UPDATED_DATA_NASCIMENTO)
            .criado(UPDATED_CRIADO)
            .email(UPDATED_EMAIL)
            .contato(UPDATED_CONTATO);

        restPerfilUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPerfilUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPerfilUser))
            )
            .andExpect(status().isOk());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeUpdate);
        PerfilUser testPerfilUser = perfilUserList.get(perfilUserList.size() - 1);
        assertThat(testPerfilUser.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testPerfilUser.getSenha()).isEqualTo(UPDATED_SENHA);
        assertThat(testPerfilUser.getFotoUrl()).isEqualTo(UPDATED_FOTO_URL);
        assertThat(testPerfilUser.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testPerfilUser.getDataNascimento()).isEqualTo(UPDATED_DATA_NASCIMENTO);
        assertThat(testPerfilUser.getCriado()).isEqualTo(UPDATED_CRIADO);
        assertThat(testPerfilUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testPerfilUser.getContato()).isEqualTo(UPDATED_CONTATO);
    }

    @Test
    @Transactional
    void patchNonExistingPerfilUser() throws Exception {
        int databaseSizeBeforeUpdate = perfilUserRepository.findAll().size();
        perfilUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPerfilUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, perfilUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(perfilUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPerfilUser() throws Exception {
        int databaseSizeBeforeUpdate = perfilUserRepository.findAll().size();
        perfilUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(perfilUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPerfilUser() throws Exception {
        int databaseSizeBeforeUpdate = perfilUserRepository.findAll().size();
        perfilUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilUserMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(perfilUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PerfilUser in the database
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePerfilUser() throws Exception {
        // Initialize the database
        perfilUserRepository.saveAndFlush(perfilUser);

        int databaseSizeBeforeDelete = perfilUserRepository.findAll().size();

        // Delete the perfilUser
        restPerfilUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, perfilUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PerfilUser> perfilUserList = perfilUserRepository.findAll();
        assertThat(perfilUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
