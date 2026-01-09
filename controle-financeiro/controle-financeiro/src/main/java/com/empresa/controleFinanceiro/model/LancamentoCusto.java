package com.empresa.controleFinanceiro.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class LancamentoCusto {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private CentroCusto centroCusto;

    private BigDecimal valor;
    private LocalDate dataLancamento;
    private String descricao;
    private String usuarioResponsavel;

    //getters e setters

    public CentroCusto getCentroCusto() {
        return centroCusto;
    }

    public void setCentroCusto(CentroCusto centroCusto) {
        this.centroCusto = centroCusto;
    }

    public LocalDate getDataLancamento() {
        return dataLancamento;
    }

    public void setDataLancamento(LocalDate dataLancamento) {
        this.dataLancamento = dataLancamento;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsuarioResponsavel() {
        return usuarioResponsavel;
    }

    public void setUsuarioResponsavel(String usuarioResponsavel) {
        this.usuarioResponsavel = usuarioResponsavel;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LancamentoCusto() {}

    public LancamentoCusto(CentroCusto centroCusto, BigDecimal valor, LocalDate dataLancamento, String descricao, String usuarioResponsavel) {
        this.centroCusto = centroCusto;
        this.valor = valor;
        this.dataLancamento = dataLancamento;
        this.descricao = descricao;
        this.usuarioResponsavel = usuarioResponsavel;
    }
}
