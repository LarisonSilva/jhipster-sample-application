package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ProdutoEmEstoque;
import com.mycompany.myapp.repository.ProdutoEmEstoqueRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ProdutoEmEstoque}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProdutoEmEstoqueResource {

    private final Logger log = LoggerFactory.getLogger(ProdutoEmEstoqueResource.class);

    private static final String ENTITY_NAME = "produtoEmEstoque";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProdutoEmEstoqueRepository produtoEmEstoqueRepository;

    public ProdutoEmEstoqueResource(ProdutoEmEstoqueRepository produtoEmEstoqueRepository) {
        this.produtoEmEstoqueRepository = produtoEmEstoqueRepository;
    }

    /**
     * {@code POST  /produto-em-estoques} : Create a new produtoEmEstoque.
     *
     * @param produtoEmEstoque the produtoEmEstoque to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new produtoEmEstoque, or with status {@code 400 (Bad Request)} if the produtoEmEstoque has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/produto-em-estoques")
    public ResponseEntity<ProdutoEmEstoque> createProdutoEmEstoque(@Valid @RequestBody ProdutoEmEstoque produtoEmEstoque)
        throws URISyntaxException {
        log.debug("REST request to save ProdutoEmEstoque : {}", produtoEmEstoque);
        if (produtoEmEstoque.getId() != null) {
            throw new BadRequestAlertException("A new produtoEmEstoque cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProdutoEmEstoque result = produtoEmEstoqueRepository.save(produtoEmEstoque);
        return ResponseEntity
            .created(new URI("/api/produto-em-estoques/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /produto-em-estoques/:id} : Updates an existing produtoEmEstoque.
     *
     * @param id the id of the produtoEmEstoque to save.
     * @param produtoEmEstoque the produtoEmEstoque to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produtoEmEstoque,
     * or with status {@code 400 (Bad Request)} if the produtoEmEstoque is not valid,
     * or with status {@code 500 (Internal Server Error)} if the produtoEmEstoque couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/produto-em-estoques/{id}")
    public ResponseEntity<ProdutoEmEstoque> updateProdutoEmEstoque(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProdutoEmEstoque produtoEmEstoque
    ) throws URISyntaxException {
        log.debug("REST request to update ProdutoEmEstoque : {}, {}", id, produtoEmEstoque);
        if (produtoEmEstoque.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produtoEmEstoque.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produtoEmEstoqueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProdutoEmEstoque result = produtoEmEstoqueRepository.save(produtoEmEstoque);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produtoEmEstoque.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /produto-em-estoques/:id} : Partial updates given fields of an existing produtoEmEstoque, field will ignore if it is null
     *
     * @param id the id of the produtoEmEstoque to save.
     * @param produtoEmEstoque the produtoEmEstoque to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produtoEmEstoque,
     * or with status {@code 400 (Bad Request)} if the produtoEmEstoque is not valid,
     * or with status {@code 404 (Not Found)} if the produtoEmEstoque is not found,
     * or with status {@code 500 (Internal Server Error)} if the produtoEmEstoque couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/produto-em-estoques/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ProdutoEmEstoque> partialUpdateProdutoEmEstoque(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProdutoEmEstoque produtoEmEstoque
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProdutoEmEstoque partially : {}, {}", id, produtoEmEstoque);
        if (produtoEmEstoque.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produtoEmEstoque.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produtoEmEstoqueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProdutoEmEstoque> result = produtoEmEstoqueRepository
            .findById(produtoEmEstoque.getId())
            .map(
                existingProdutoEmEstoque -> {
                    if (produtoEmEstoque.getNome() != null) {
                        existingProdutoEmEstoque.setNome(produtoEmEstoque.getNome());
                    }
                    if (produtoEmEstoque.getDescricao() != null) {
                        existingProdutoEmEstoque.setDescricao(produtoEmEstoque.getDescricao());
                    }
                    if (produtoEmEstoque.getFotoUrl() != null) {
                        existingProdutoEmEstoque.setFotoUrl(produtoEmEstoque.getFotoUrl());
                    }
                    if (produtoEmEstoque.getSku() != null) {
                        existingProdutoEmEstoque.setSku(produtoEmEstoque.getSku());
                    }
                    if (produtoEmEstoque.getEan() != null) {
                        existingProdutoEmEstoque.setEan(produtoEmEstoque.getEan());
                    }
                    if (produtoEmEstoque.getCriado() != null) {
                        existingProdutoEmEstoque.setCriado(produtoEmEstoque.getCriado());
                    }
                    if (produtoEmEstoque.getPreco() != null) {
                        existingProdutoEmEstoque.setPreco(produtoEmEstoque.getPreco());
                    }
                    if (produtoEmEstoque.getPrecoPromocional() != null) {
                        existingProdutoEmEstoque.setPrecoPromocional(produtoEmEstoque.getPrecoPromocional());
                    }
                    if (produtoEmEstoque.getTotalEstoque() != null) {
                        existingProdutoEmEstoque.setTotalEstoque(produtoEmEstoque.getTotalEstoque());
                    }

                    return existingProdutoEmEstoque;
                }
            )
            .map(produtoEmEstoqueRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produtoEmEstoque.getId().toString())
        );
    }

    /**
     * {@code GET  /produto-em-estoques} : get all the produtoEmEstoques.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of produtoEmEstoques in body.
     */
    @GetMapping("/produto-em-estoques")
    public List<ProdutoEmEstoque> getAllProdutoEmEstoques() {
        log.debug("REST request to get all ProdutoEmEstoques");
        return produtoEmEstoqueRepository.findAll();
    }

    /**
     * {@code GET  /produto-em-estoques/:id} : get the "id" produtoEmEstoque.
     *
     * @param id the id of the produtoEmEstoque to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the produtoEmEstoque, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/produto-em-estoques/{id}")
    public ResponseEntity<ProdutoEmEstoque> getProdutoEmEstoque(@PathVariable Long id) {
        log.debug("REST request to get ProdutoEmEstoque : {}", id);
        Optional<ProdutoEmEstoque> produtoEmEstoque = produtoEmEstoqueRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(produtoEmEstoque);
    }

    /**
     * {@code DELETE  /produto-em-estoques/:id} : delete the "id" produtoEmEstoque.
     *
     * @param id the id of the produtoEmEstoque to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/produto-em-estoques/{id}")
    public ResponseEntity<Void> deleteProdutoEmEstoque(@PathVariable Long id) {
        log.debug("REST request to delete ProdutoEmEstoque : {}", id);
        produtoEmEstoqueRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
