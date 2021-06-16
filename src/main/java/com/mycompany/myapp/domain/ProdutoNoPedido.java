package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProdutoNoPedido.
 */
@Entity
@Table(name = "produto_no_pedido")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProdutoNoPedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "quantidade")
    private Integer quantidade;

    @Column(name = "preco")
    private Double preco;

    @Column(name = "criado")
    private ZonedDateTime criado;

    @ManyToOne
    private ProdutoEmEstoque produtoEmEstoque;

    @ManyToOne
    @JsonIgnoreProperties(value = { "perfilUser", "endereco" }, allowSetters = true)
    private Pedido pedido;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProdutoNoPedido id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getQuantidade() {
        return this.quantidade;
    }

    public ProdutoNoPedido quantidade(Integer quantidade) {
        this.quantidade = quantidade;
        return this;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Double getPreco() {
        return this.preco;
    }

    public ProdutoNoPedido preco(Double preco) {
        this.preco = preco;
        return this;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public ZonedDateTime getCriado() {
        return this.criado;
    }

    public ProdutoNoPedido criado(ZonedDateTime criado) {
        this.criado = criado;
        return this;
    }

    public void setCriado(ZonedDateTime criado) {
        this.criado = criado;
    }

    public ProdutoEmEstoque getProdutoEmEstoque() {
        return this.produtoEmEstoque;
    }

    public ProdutoNoPedido produtoEmEstoque(ProdutoEmEstoque produtoEmEstoque) {
        this.setProdutoEmEstoque(produtoEmEstoque);
        return this;
    }

    public void setProdutoEmEstoque(ProdutoEmEstoque produtoEmEstoque) {
        this.produtoEmEstoque = produtoEmEstoque;
    }

    public Pedido getPedido() {
        return this.pedido;
    }

    public ProdutoNoPedido pedido(Pedido pedido) {
        this.setPedido(pedido);
        return this;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProdutoNoPedido)) {
            return false;
        }
        return id != null && id.equals(((ProdutoNoPedido) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProdutoNoPedido{" +
            "id=" + getId() +
            ", quantidade=" + getQuantidade() +
            ", preco=" + getPreco() +
            ", criado='" + getCriado() + "'" +
            "}";
    }
}
