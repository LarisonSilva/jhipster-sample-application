package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ProdutoNoPedido;
import com.mycompany.myapp.repository.ProdutoNoPedidoRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ProdutoNoPedido}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProdutoNoPedidoResource {

    private final Logger log = LoggerFactory.getLogger(ProdutoNoPedidoResource.class);

    private static final String ENTITY_NAME = "produtoNoPedido";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProdutoNoPedidoRepository produtoNoPedidoRepository;

    public ProdutoNoPedidoResource(ProdutoNoPedidoRepository produtoNoPedidoRepository) {
        this.produtoNoPedidoRepository = produtoNoPedidoRepository;
    }

    /**
     * {@code POST  /produto-no-pedidos} : Create a new produtoNoPedido.
     *
     * @param produtoNoPedido the produtoNoPedido to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new produtoNoPedido, or with status {@code 400 (Bad Request)} if the produtoNoPedido has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/produto-no-pedidos")
    public ResponseEntity<ProdutoNoPedido> createProdutoNoPedido(@RequestBody ProdutoNoPedido produtoNoPedido) throws URISyntaxException {
        log.debug("REST request to save ProdutoNoPedido : {}", produtoNoPedido);
        if (produtoNoPedido.getId() != null) {
            throw new BadRequestAlertException("A new produtoNoPedido cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProdutoNoPedido result = produtoNoPedidoRepository.save(produtoNoPedido);
        return ResponseEntity
            .created(new URI("/api/produto-no-pedidos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /produto-no-pedidos/:id} : Updates an existing produtoNoPedido.
     *
     * @param id the id of the produtoNoPedido to save.
     * @param produtoNoPedido the produtoNoPedido to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produtoNoPedido,
     * or with status {@code 400 (Bad Request)} if the produtoNoPedido is not valid,
     * or with status {@code 500 (Internal Server Error)} if the produtoNoPedido couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/produto-no-pedidos/{id}")
    public ResponseEntity<ProdutoNoPedido> updateProdutoNoPedido(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProdutoNoPedido produtoNoPedido
    ) throws URISyntaxException {
        log.debug("REST request to update ProdutoNoPedido : {}, {}", id, produtoNoPedido);
        if (produtoNoPedido.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produtoNoPedido.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produtoNoPedidoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProdutoNoPedido result = produtoNoPedidoRepository.save(produtoNoPedido);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produtoNoPedido.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /produto-no-pedidos/:id} : Partial updates given fields of an existing produtoNoPedido, field will ignore if it is null
     *
     * @param id the id of the produtoNoPedido to save.
     * @param produtoNoPedido the produtoNoPedido to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produtoNoPedido,
     * or with status {@code 400 (Bad Request)} if the produtoNoPedido is not valid,
     * or with status {@code 404 (Not Found)} if the produtoNoPedido is not found,
     * or with status {@code 500 (Internal Server Error)} if the produtoNoPedido couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/produto-no-pedidos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ProdutoNoPedido> partialUpdateProdutoNoPedido(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProdutoNoPedido produtoNoPedido
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProdutoNoPedido partially : {}, {}", id, produtoNoPedido);
        if (produtoNoPedido.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produtoNoPedido.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produtoNoPedidoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProdutoNoPedido> result = produtoNoPedidoRepository
            .findById(produtoNoPedido.getId())
            .map(
                existingProdutoNoPedido -> {
                    if (produtoNoPedido.getQuantidade() != null) {
                        existingProdutoNoPedido.setQuantidade(produtoNoPedido.getQuantidade());
                    }
                    if (produtoNoPedido.getPreco() != null) {
                        existingProdutoNoPedido.setPreco(produtoNoPedido.getPreco());
                    }
                    if (produtoNoPedido.getCriado() != null) {
                        existingProdutoNoPedido.setCriado(produtoNoPedido.getCriado());
                    }

                    return existingProdutoNoPedido;
                }
            )
            .map(produtoNoPedidoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produtoNoPedido.getId().toString())
        );
    }

    /**
     * {@code GET  /produto-no-pedidos} : get all the produtoNoPedidos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of produtoNoPedidos in body.
     */
    @GetMapping("/produto-no-pedidos")
    public List<ProdutoNoPedido> getAllProdutoNoPedidos() {
        log.debug("REST request to get all ProdutoNoPedidos");
        return produtoNoPedidoRepository.findAll();
    }

    /**
     * {@code GET  /produto-no-pedidos/:id} : get the "id" produtoNoPedido.
     *
     * @param id the id of the produtoNoPedido to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the produtoNoPedido, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/produto-no-pedidos/{id}")
    public ResponseEntity<ProdutoNoPedido> getProdutoNoPedido(@PathVariable Long id) {
        log.debug("REST request to get ProdutoNoPedido : {}", id);
        Optional<ProdutoNoPedido> produtoNoPedido = produtoNoPedidoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(produtoNoPedido);
    }

    /**
     * {@code DELETE  /produto-no-pedidos/:id} : delete the "id" produtoNoPedido.
     *
     * @param id the id of the produtoNoPedido to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/produto-no-pedidos/{id}")
    public ResponseEntity<Void> deleteProdutoNoPedido(@PathVariable Long id) {
        log.debug("REST request to delete ProdutoNoPedido : {}", id);
        produtoNoPedidoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
