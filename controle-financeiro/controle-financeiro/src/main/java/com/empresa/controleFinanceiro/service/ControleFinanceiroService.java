package com.empresa.controleFinanceiro.service;

import com.empresa.controleFinanceiro.model.LancamentoCusto;
import com.empresa.controleFinanceiro.model.Pagamento;
import com.empresa.controleFinanceiro.repository.LancamentoCustoRepository;
import com.empresa.controleFinanceiro.repository.PagamentoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ControleFinanceiroService {

    private final PagamentoRepository pagamentoRepository;
    private final LancamentoCustoRepository lancamentoRepository;

    public ControleFinanceiroService(
            PagamentoRepository pagamentoRepository,
            LancamentoCustoRepository lancamentoRepository) {

        this.pagamentoRepository = pagamentoRepository;
        this.lancamentoRepository = lancamentoRepository;
    }

    public BigDecimal totalPago(Long obraId) {
        return pagamentoRepository.findByObra_Id(obraId)
                .stream()
                .map(Pagamento::getValorPago)
                .filter(valor -> valor != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal totalGasto(Long obraId) {
        return lancamentoRepository.findByCentroCusto_Obra_Id(obraId)
                .stream()
                .map(LancamentoCusto::getValor)
                .filter(valor -> valor != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
