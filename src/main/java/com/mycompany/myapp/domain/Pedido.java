package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.AndamentoPedido;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Pedido.
 */
@Entity
@Table(name = "pedido")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "efetuado")
    private ZonedDateTime efetuado;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AndamentoPedido status;

    @Column(name = "preco_total")
    private Double precoTotal;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "comentarios")
    private String comentarios;

    @Column(name = "codigo_pagamento")
    private String codigoPagamento;

    @ManyToOne
    private PerfilUser perfilUser;

    @ManyToOne
    @JsonIgnoreProperties(value = { "perfilUser" }, allowSetters = true)
    private Endereco endereco;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pedido id(Long id) {
        this.id = id;
        return this;
    }

    public ZonedDateTime getEfetuado() {
        return this.efetuado;
    }

    public Pedido efetuado(ZonedDateTime efetuado) {
        this.efetuado = efetuado;
        return this;
    }

    public void setEfetuado(ZonedDateTime efetuado) {
        this.efetuado = efetuado;
    }

    public AndamentoPedido getStatus() {
        return this.status;
    }

    public Pedido status(AndamentoPedido status) {
        this.status = status;
        return this;
    }

    public void setStatus(AndamentoPedido status) {
        this.status = status;
    }

    public Double getPrecoTotal() {
        return this.precoTotal;
    }

    public Pedido precoTotal(Double precoTotal) {
        this.precoTotal = precoTotal;
        return this;
    }

    public void setPrecoTotal(Double precoTotal) {
        this.precoTotal = precoTotal;
    }

    public String getComentarios() {
        return this.comentarios;
    }

    public Pedido comentarios(String comentarios) {
        this.comentarios = comentarios;
        return this;
    }

    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
    }

    public String getCodigoPagamento() {
        return this.codigoPagamento;
    }

    public Pedido codigoPagamento(String codigoPagamento) {
        this.codigoPagamento = codigoPagamento;
        return this;
    }

    public void setCodigoPagamento(String codigoPagamento) {
        this.codigoPagamento = codigoPagamento;
    }

    public PerfilUser getPerfilUser() {
        return this.perfilUser;
    }

    public Pedido perfilUser(PerfilUser perfilUser) {
        this.setPerfilUser(perfilUser);
        return this;
    }

    public void setPerfilUser(PerfilUser perfilUser) {
        this.perfilUser = perfilUser;
    }

    public Endereco getEndereco() {
        return this.endereco;
    }

    public Pedido endereco(Endereco endereco) {
        this.setEndereco(endereco);
        return this;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pedido)) {
            return false;
        }
        return id != null && id.equals(((Pedido) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pedido{" +
            "id=" + getId() +
            ", efetuado='" + getEfetuado() + "'" +
            ", status='" + getStatus() + "'" +
            ", precoTotal=" + getPrecoTotal() +
            ", comentarios='" + getComentarios() + "'" +
            ", codigoPagamento='" + getCodigoPagamento() + "'" +
            "}";
    }
}
