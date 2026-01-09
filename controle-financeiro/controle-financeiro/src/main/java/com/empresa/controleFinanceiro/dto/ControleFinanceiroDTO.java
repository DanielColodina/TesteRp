package com.empresa.controleFinanceiro.dto;

import java.math.BigDecimal;

public  record ControleFinanceiroDTO (
    //Atributos
    String cliente,
    String endereco,
    BigDecimal valorTotal,
    BigDecimal valorPago,
    BigDecimal valorGasto,
    BigDecimal saldo

) {}
