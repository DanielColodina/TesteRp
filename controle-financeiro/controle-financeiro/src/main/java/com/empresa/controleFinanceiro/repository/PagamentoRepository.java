package com.empresa.controleFinanceiro.repository;

import com.empresa.controleFinanceiro.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findByObra_Id(Long obraId);
}
