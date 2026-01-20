package com.empresa.controleFinanceiro.repository;

import com.empresa.controleFinanceiro.model.LancamentoCusto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface LancamentoCustoRepository extends JpaRepository<LancamentoCusto, Long> {

    List<LancamentoCusto> findByCentroCusto_Obra_Id(Long obraId);
}
