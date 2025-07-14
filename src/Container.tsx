import { useEffect, useState } from "react";
import './Container.css';

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
  const [erroMensagem, setErroMensagem] = useState("");
  const [produtos, setProdutos] = useState<ProdutosState[]>([]);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/produtos");
        const result = await resposta.json();

        if (resposta.status === 200) {
          setProdutos(result);
        } else if (resposta.status === 400) {
          setErroMensagem(result.mensagem);
        }
      } catch (erro) {
        setErroMensagem("Produto não encontrado");
      }
    };

    fetchData();
  }, []);

  async function trataForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const produtoEditado: ProdutosState = {
      id: parseInt(id),
      nome,
      preco: parseFloat(preco),
      categoria,
    };

    try {
      const resposta = await fetch(`http://localhost:8000/produtos/${produtoEditado.id}`, {
        method: modoEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(produtoEditado)
      });

      const result = await resposta.json();

      if (resposta.status === 200) {
        if (modoEdicao) {
          setProdutos(produtos.map(p => p.id === produtoEditado.id ? result : p));
          setModoEdicao(false);
        } else {
          setProdutos([...produtos, result]);
        }

        setId("");
        setNome("");
        setPreco("");
        setCategoria("");
        setErroMensagem("");
      } else if (resposta.status === 400) {
        setErroMensagem(result.mensagem);
      }

    } catch (erro) {
      setErroMensagem("Erro ao salvar produto");
    }
  }

  function iniciarEdicao(produto: ProdutosState) {
    setId(produto.id.toString());
    setNome(produto.nome);
    setPreco(produto.preco.toString());
    setCategoria(produto.categoria);
    setModoEdicao(true);
  }

  function trataId(e: React.ChangeEvent<HTMLInputElement>) {
    setId(e.target.value);
  }

  function trataNome(e: React.ChangeEvent<HTMLInputElement>) {
    setNome(e.target.value);
  }

  function trataPreco(e: React.ChangeEvent<HTMLInputElement>) {
    setPreco(e.target.value);
  }

  function trataCategoria(e: React.ChangeEvent<HTMLInputElement>) {
    setCategoria(e.target.value);
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
          <h1>{modoEdicao ? "Editar Produto" : "Cadastro de Produto"}</h1>
          <form onSubmit={trataForm}>
            <input type="text" placeholder="ID" value={id} onChange={trataId} required />
            <input type="text" placeholder="Nome" value={nome} onChange={trataNome} required />
            <input type="text" placeholder="Preço" value={preco} onChange={trataPreco} required />
            <input type="text" placeholder="Categoria" value={categoria} onChange={trataCategoria} required />
            <input type="submit" value={modoEdicao ? "Atualizar" : "Cadastrar"} />
          </form>
        </div>

        <div className="container-listagem">
          <h2>Lista de Produtos</h2>
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
