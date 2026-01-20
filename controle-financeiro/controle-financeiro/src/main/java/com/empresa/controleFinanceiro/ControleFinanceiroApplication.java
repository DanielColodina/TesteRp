package com.empresa.controleFinanceiro;

import com.empresa.controleFinanceiro.model.CentroCusto;
import com.empresa.controleFinanceiro.model.LancamentoCusto;
import com.empresa.controleFinanceiro.model.Obra;
import com.empresa.controleFinanceiro.model.Pagamento;
import com.empresa.controleFinanceiro.repository.CentroCustoRepository;
import com.empresa.controleFinanceiro.repository.LancamentoCustoRepository;
import com.empresa.controleFinanceiro.repository.ObraRepository;
import com.empresa.controleFinanceiro.repository.PagamentoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;

@SpringBootApplication
public class ControleFinanceiroApplication {

	public static void main(String[] args) {
		SpringApplication.run(ControleFinanceiroApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(ObraRepository obraRepository, PagamentoRepository pagamentoRepository,
								  CentroCustoRepository centroCustoRepository, LancamentoCustoRepository lancamentoRepository) {
		return args -> {
			// Obra 1
			Obra obra1 = new Obra();
			obra1.setNomeCliente("João Silva");
			obra1.setEndereco("Rua das Flores, 123");
			obra1.setNomeObra("Reforma da Cozinha");
			obra1.setValorTotal(new BigDecimal("50000.00"));
			obra1.setDataInicio(LocalDate.of(2023, 1, 15));
			obra1.setDataFinalizacao(LocalDate.of(2023, 3, 15));
			obra1 = obraRepository.save(obra1);

			CentroCusto centroCusto1 = new CentroCusto();
			centroCusto1.setObra(obra1);
			centroCusto1.setNome("Materiais");
			centroCusto1.setDescricao("Custos com materiais");
			centroCusto1 = centroCustoRepository.save(centroCusto1);

			pagamentoRepository.save(new Pagamento(obra1, new BigDecimal("20000.00"), LocalDate.of(2023, 1, 20), "admin", "Pagamento inicial"));
			pagamentoRepository.save(new Pagamento(obra1, new BigDecimal("15000.00"), LocalDate.of(2023, 2, 10), "admin", "Segundo pagamento"));

			lancamentoRepository.save(new LancamentoCusto(centroCusto1, new BigDecimal("8000.00"), LocalDate.of(2023, 1, 25), "Compra de azulejos", "admin"));
			lancamentoRepository.save(new LancamentoCusto(centroCusto1, new BigDecimal("5000.00"), LocalDate.of(2023, 2, 5), "Compra de tintas", "admin"));

			// Obra 2
			Obra obra2 = new Obra();
			obra2.setNomeCliente("Maria Santos");
			obra2.setEndereco("Av. Brasil, 456");
			obra2.setNomeObra("Construção de Sala");
			obra2.setValorTotal(new BigDecimal("75000.00"));
			obra2.setDataInicio(LocalDate.of(2023, 2, 1));
			obra2.setDataFinalizacao(LocalDate.of(2023, 5, 1));
			obra2 = obraRepository.save(obra2);

			CentroCusto centroCusto2 = new CentroCusto();
			centroCusto2.setObra(obra2);
			centroCusto2.setNome("Mão de Obra");
			centroCusto2.setDescricao("Pagamentos para trabalhadores");
			centroCusto2 = centroCustoRepository.save(centroCusto2);

			pagamentoRepository.save(new Pagamento(obra2, new BigDecimal("30000.00"), LocalDate.of(2023, 2, 15), "admin", "Entrada"));
			pagamentoRepository.save(new Pagamento(obra2, new BigDecimal("25000.00"), LocalDate.of(2023, 3, 20), "admin", "Intermediário"));

			lancamentoRepository.save(new LancamentoCusto(centroCusto2, new BigDecimal("15000.00"), LocalDate.of(2023, 2, 10), "Pagamento pedreiro", "admin"));
			lancamentoRepository.save(new LancamentoCusto(centroCusto2, new BigDecimal("12000.00"), LocalDate.of(2023, 3, 15), "Pagamento eletricista", "admin"));

			// Obra 3
			Obra obra3 = new Obra();
			obra3.setNomeCliente("Carlos Oliveira");
			obra3.setEndereco("Rua Verde, 789");
			obra3.setNomeObra("Reforma do Banheiro");
			obra3.setValorTotal(new BigDecimal("30000.00"));
			obra3.setDataInicio(LocalDate.of(2023, 3, 10));
			obra3.setDataFinalizacao(LocalDate.of(2023, 4, 20));
			obra3 = obraRepository.save(obra3);

			CentroCusto centroCusto3 = new CentroCusto();
			centroCusto3.setObra(obra3);
			centroCusto3.setNome("Equipamentos");
			centroCusto3.setDescricao("Compra de equipamentos");
			centroCusto3 = centroCustoRepository.save(centroCusto3);

			pagamentoRepository.save(new Pagamento(obra3, new BigDecimal("15000.00"), LocalDate.of(2023, 3, 15), "admin", "Pagamento único"));
			pagamentoRepository.save(new Pagamento(obra3, new BigDecimal("10000.00"), LocalDate.of(2023, 4, 10), "admin", "Final"));

			lancamentoRepository.save(new LancamentoCusto(centroCusto3, new BigDecimal("5000.00"), LocalDate.of(2023, 3, 20), "Compra de chuveiro", "admin"));
			lancamentoRepository.save(new LancamentoCusto(centroCusto3, new BigDecimal("3000.00"), LocalDate.of(2023, 4, 5), "Compra de azulejos", "admin"));

			System.out.println("Dados de exemplo inseridos no banco de dados.");
		};
	}

}
