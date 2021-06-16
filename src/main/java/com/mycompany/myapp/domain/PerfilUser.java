package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PerfilUser.
 */
@Entity
@Table(name = "perfil_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PerfilUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotNull
    @Column(name = "senha", nullable = false)
    private String senha;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "criado")
    private ZonedDateTime criado;

    @Column(name = "email")
    private String email;

    @Column(name = "contato")
    private String contato;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PerfilUser id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public PerfilUser nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return this.senha;
    }

    public PerfilUser senha(String senha) {
        this.senha = senha;
        return this;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getFotoUrl() {
        return this.fotoUrl;
    }

    public PerfilUser fotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
        return this;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getCpf() {
        return this.cpf;
    }

    public PerfilUser cpf(String cpf) {
        this.cpf = cpf;
        return this;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public LocalDate getDataNascimento() {
        return this.dataNascimento;
    }

    public PerfilUser dataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
        return this;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public ZonedDateTime getCriado() {
        return this.criado;
    }

    public PerfilUser criado(ZonedDateTime criado) {
        this.criado = criado;
        return this;
    }

    public void setCriado(ZonedDateTime criado) {
        this.criado = criado;
    }

    public String getEmail() {
        return this.email;
    }

    public PerfilUser email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContato() {
        return this.contato;
    }

    public PerfilUser contato(String contato) {
        this.contato = contato;
        return this;
    }

    public void setContato(String contato) {
        this.contato = contato;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PerfilUser)) {
            return false;
        }
        return id != null && id.equals(((PerfilUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PerfilUser{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", senha='" + getSenha() + "'" +
            ", fotoUrl='" + getFotoUrl() + "'" +
            ", cpf='" + getCpf() + "'" +
            ", dataNascimento='" + getDataNascimento() + "'" +
            ", criado='" + getCriado() + "'" +
            ", email='" + getEmail() + "'" +
            ", contato='" + getContato() + "'" +
            "}";
    }
}
