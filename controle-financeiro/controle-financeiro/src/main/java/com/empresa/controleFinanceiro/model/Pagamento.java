package com.empresa.controleFinanceiro.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Pagamento {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Obra obra;

    private BigDecimal valorPago;
    private LocalDate dataPagamento;
    private String usuarioResponsavel;
    private String observacao;


    //getters e setters


    public LocalDate getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDate dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Obra getObra() {
        return obra;
    }

    public void setObra(Obra obra) {
        this.obra = obra;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public String getUsuarioResponsavel() {
        return usuarioResponsavel;
    }

    public void setUsuarioResponsavel(String usuarioResponsavel) {
        this.usuarioResponsavel = usuarioResponsavel;
    }

    public BigDecimal getValorPago() {
        return valorPago;
    }

    public void setValorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
    }

    public Pagamento() {}

    public Pagamento(Obra obra, BigDecimal valorPago, LocalDate dataPagamento, String usuarioResponsavel, String observacao) {
        this.obra = obra;
        this.valorPago = valorPago;
        this.dataPagamento = dataPagamento;
        this.usuarioResponsavel = usuarioResponsavel;
        this.observacao = observacao;
    }
}
