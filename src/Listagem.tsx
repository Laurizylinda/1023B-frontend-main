import { useEffect, useState } from "react";
import './Container.tsx';

interface ProdutosState {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

function Container() {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [produtos, setProdutos] = useState<ProdutosState[]>([]);
  const [erroMensagem, setErroMensagem] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/produtos");
        if (resposta.ok) {
          const data = await resposta.json();
          setProdutos(data);
          setErroMensagem("");
        } else {
          const errorData = await resposta.json();
          setErroMensagem(errorData.mensagem || "Erro ao buscar produtos");
        }
      } catch {
        setErroMensagem("Erro ao conectar ao servidor");
      }
    };
    fetchData();
  }, []);

  async function trataForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !nome || !preco || !categoria) {
      setErroMensagem("Preencha todos os campos");
      return;
    }

    const produto: ProdutosState = {
      id: parseInt(id),
      nome,
      preco: parseFloat(preco),
      categoria,
    };

    try {
      const resposta = await fetch(`http://localhost:8000/produtos/${produto.id}`, {
        method: modoEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      const result = await resposta.json();

      if (resposta.ok) {
        if (modoEdicao) {
          setProdutos(produtos.map(p => (p.id === produto.id ? result : p)));
          setModoEdicao(false);
        } else {
          setProdutos([...produtos, result]);
        }
        setId("");
        setNome("");
        setPreco("");
        setCategoria("");
        setErroMensagem("");
      } else {
        setErroMensagem(result.mensagem || "Erro ao salvar produto");
      }
    } catch {
      setErroMensagem("Erro ao salvar produto");
    }
  }

  function iniciarEdicao(produto: ProdutosState) {
    setId(produto.id.toString());
    setNome(produto.nome);
    setPreco(produto.preco.toString());
    setCategoria(produto.categoria);
    setModoEdicao(true);
    setErroMensagem("");
  }

  return (
    <>
      {erroMensagem && (
        <div className="mensagem-erro">
          <p>{erroMensagem}</p>
        </div>
      )}

      <div className="container">
        <div className="container-cadastro">
          <h1>{modoEdicao ? "Editar Produto" : "Cadastro Produto"}</h1>
          <form onSubmit={trataForm}>
            <input
              type="text"
              placeholder="Id"
              value={id}
              onChange={e => setId(e.target.value)}
              disabled={modoEdicao} // desativa id na edição para evitar problemas
            />
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
            <input
              type="text"
              placeholder="Preço"
              value={preco}
              onChange={e => setPreco(e.target.value)}
            />
            <input
              type="text"
              placeholder="Categoria"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
            />
            <input type="submit" value={modoEdicao ? "Atualizar" : "Cadastrar"} />
          </form>
        </div>

        <div className="container-listagem">
          <h2>Lista de Produtos</h2>
          {produtos.length === 0 && <p>Nenhum produto cadastrado.</p>}
          {produtos.map(produto => (
            <div key={produto.id} className="container-produto">
              <div><strong>Nome:</strong> {produto.nome}</div>
              <div><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</div>
              <div><strong>Categoria:</strong> {produto.categoria}</div>
              <button onClick={() => iniciarEdicao(produto)}>Editar</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Container;