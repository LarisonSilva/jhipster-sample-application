package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A ProdutoEmEstoque.
 */
@Entity
@Table(name = "produto_em_estoque")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProdutoEmEstoque implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "descricao")
    private String descricao;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "sku")
    private String sku;

    @Column(name = "ean")
    private String ean;

    @Column(name = "criado")
    private ZonedDateTime criado;

    @Column(name = "preco")
    private Double preco;

    @Column(name = "preco_promocional")
    private Double precoPromocional;

    @Column(name = "total_estoque")
    private Integer totalEstoque;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProdutoEmEstoque id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public ProdutoEmEstoque nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public ProdutoEmEstoque descricao(String descricao) {
        this.descricao = descricao;
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getFotoUrl() {
        return this.fotoUrl;
    }

    public ProdutoEmEstoque fotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
        return this;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getSku() {
        return this.sku;
    }

    public ProdutoEmEstoque sku(String sku) {
        this.sku = sku;
        return this;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getEan() {
        return this.ean;
    }

    public ProdutoEmEstoque ean(String ean) {
        this.ean = ean;
        return this;
    }

    public void setEan(String ean) {
        this.ean = ean;
    }

    public ZonedDateTime getCriado() {
        return this.criado;
    }

    public ProdutoEmEstoque criado(ZonedDateTime criado) {
        this.criado = criado;
        return this;
    }

    public void setCriado(ZonedDateTime criado) {
        this.criado = criado;
    }

    public Double getPreco() {
        return this.preco;
    }

    public ProdutoEmEstoque preco(Double preco) {
        this.preco = preco;
        return this;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public Double getPrecoPromocional() {
        return this.precoPromocional;
    }

    public ProdutoEmEstoque precoPromocional(Double precoPromocional) {
        this.precoPromocional = precoPromocional;
        return this;
    }

    public void setPrecoPromocional(Double precoPromocional) {
        this.precoPromocional = precoPromocional;
    }

    public Integer getTotalEstoque() {
        return this.totalEstoque;
    }

    public ProdutoEmEstoque totalEstoque(Integer totalEstoque) {
        this.totalEstoque = totalEstoque;
        return this;
    }

    public void setTotalEstoque(Integer totalEstoque) {
        this.totalEstoque = totalEstoque;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProdutoEmEstoque)) {
            return false;
        }
        return id != null && id.equals(((ProdutoEmEstoque) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProdutoEmEstoque{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", fotoUrl='" + getFotoUrl() + "'" +
            ", sku='" + getSku() + "'" +
            ", ean='" + getEan() + "'" +
            ", criado='" + getCriado() + "'" +
            ", preco=" + getPreco() +
            ", precoPromocional=" + getPrecoPromocional() +
            ", totalEstoque=" + getTotalEstoque() +
            "}";
    }
}
