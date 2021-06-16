package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PerfilUser;
import com.mycompany.myapp.repository.PerfilUserRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.PerfilUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PerfilUserResource {

    private final Logger log = LoggerFactory.getLogger(PerfilUserResource.class);

    private static final String ENTITY_NAME = "perfilUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PerfilUserRepository perfilUserRepository;

    public PerfilUserResource(PerfilUserRepository perfilUserRepository) {
        this.perfilUserRepository = perfilUserRepository;
    }

    /**
     * {@code POST  /perfil-users} : Create a new perfilUser.
     *
     * @param perfilUser the perfilUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new perfilUser, or with status {@code 400 (Bad Request)} if the perfilUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/perfil-users")
    public ResponseEntity<PerfilUser> createPerfilUser(@Valid @RequestBody PerfilUser perfilUser) throws URISyntaxException {
        log.debug("REST request to save PerfilUser : {}", perfilUser);
        if (perfilUser.getId() != null) {
            throw new BadRequestAlertException("A new perfilUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PerfilUser result = perfilUserRepository.save(perfilUser);
        return ResponseEntity
            .created(new URI("/api/perfil-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /perfil-users/:id} : Updates an existing perfilUser.
     *
     * @param id the id of the perfilUser to save.
     * @param perfilUser the perfilUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated perfilUser,
     * or with status {@code 400 (Bad Request)} if the perfilUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the perfilUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/perfil-users/{id}")
    public ResponseEntity<PerfilUser> updatePerfilUser(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PerfilUser perfilUser
    ) throws URISyntaxException {
        log.debug("REST request to update PerfilUser : {}, {}", id, perfilUser);
        if (perfilUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, perfilUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!perfilUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PerfilUser result = perfilUserRepository.save(perfilUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, perfilUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /perfil-users/:id} : Partial updates given fields of an existing perfilUser, field will ignore if it is null
     *
     * @param id the id of the perfilUser to save.
     * @param perfilUser the perfilUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated perfilUser,
     * or with status {@code 400 (Bad Request)} if the perfilUser is not valid,
     * or with status {@code 404 (Not Found)} if the perfilUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the perfilUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/perfil-users/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<PerfilUser> partialUpdatePerfilUser(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PerfilUser perfilUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update PerfilUser partially : {}, {}", id, perfilUser);
        if (perfilUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, perfilUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!perfilUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PerfilUser> result = perfilUserRepository
            .findById(perfilUser.getId())
            .map(
                existingPerfilUser -> {
                    if (perfilUser.getNome() != null) {
                        existingPerfilUser.setNome(perfilUser.getNome());
                    }
                    if (perfilUser.getSenha() != null) {
                        existingPerfilUser.setSenha(perfilUser.getSenha());
                    }
                    if (perfilUser.getFotoUrl() != null) {
                        existingPerfilUser.setFotoUrl(perfilUser.getFotoUrl());
                    }
                    if (perfilUser.getCpf() != null) {
                        existingPerfilUser.setCpf(perfilUser.getCpf());
                    }
                    if (perfilUser.getDataNascimento() != null) {
                        existingPerfilUser.setDataNascimento(perfilUser.getDataNascimento());
                    }
                    if (perfilUser.getCriado() != null) {
                        existingPerfilUser.setCriado(perfilUser.getCriado());
                    }
                    if (perfilUser.getEmail() != null) {
                        existingPerfilUser.setEmail(perfilUser.getEmail());
                    }
                    if (perfilUser.getContato() != null) {
                        existingPerfilUser.setContato(perfilUser.getContato());
                    }

                    return existingPerfilUser;
                }
            )
            .map(perfilUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, perfilUser.getId().toString())
        );
    }

    /**
     * {@code GET  /perfil-users} : get all the perfilUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of perfilUsers in body.
     */
    @GetMapping("/perfil-users")
    public List<PerfilUser> getAllPerfilUsers() {
        log.debug("REST request to get all PerfilUsers");
        return perfilUserRepository.findAll();
    }

    /**
     * {@code GET  /perfil-users/:id} : get the "id" perfilUser.
     *
     * @param id the id of the perfilUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the perfilUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/perfil-users/{id}")
    public ResponseEntity<PerfilUser> getPerfilUser(@PathVariable Long id) {
        log.debug("REST request to get PerfilUser : {}", id);
        Optional<PerfilUser> perfilUser = perfilUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(perfilUser);
    }

    /**
     * {@code DELETE  /perfil-users/:id} : delete the "id" perfilUser.
     *
     * @param id the id of the perfilUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/perfil-users/{id}")
    public ResponseEntity<Void> deletePerfilUser(@PathVariable Long id) {
        log.debug("REST request to delete PerfilUser : {}", id);
        perfilUserRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
