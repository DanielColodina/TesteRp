package com.empresa.controleFinanceiro.controller;

import com.empresa.controleFinanceiro.dto.ControleFinanceiroDTO;
import com.empresa.controleFinanceiro.repository.ObraRepository;
import com.empresa.controleFinanceiro.service.ControleFinanceiroService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/controlefinanceiro")
@PreAuthorize("hasRole('FINANCEIRO')")

public class ControleFinanceiroController {

    @GetMapping("/health")
    public String health() {
        return "Aplicação funcionando!";
    }

    private final ObraRepository obraRepository;
    private final ControleFinanceiroService service;

    public ControleFinanceiroController(ObraRepository obraRepository,
                                        ControleFinanceiroService service) {
        this.obraRepository = obraRepository;
        this.service = service;
    }

    @GetMapping
    public List<ControleFinanceiroDTO> listar()  {

        return obraRepository.findAll().stream().map(obra -> {

            BigDecimal pago = service.totalPago(obra.getId());
            BigDecimal gasto = service.totalGasto(obra.getId());

            return new ControleFinanceiroDTO(
                    obra.getNomeCliente(),
                    obra.getEndereco(),
                    obra.getValorTotal(),
                    pago,
                    gasto,
                    obra.getValorTotal().subtract(pago)
            );
        }).toList();
    }
}
