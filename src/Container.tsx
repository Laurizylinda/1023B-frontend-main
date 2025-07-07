import { useEffect, useState } from "react"
import './Container.css'

interface ProdutosState {
  id: number,
  nome: string,
  preco: number,
  categoria: string
}

function Container() {
  const [id, setId] = useState("")
  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState("")
  const [erroMensagem, setErroMensagem] = useState("")
  const [categoria, setCategoria] = useState("")
  const [produtos, setProdutos] = useState<ProdutosState[]>([])
  const [modoEdicao, setModoEdicao] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/produtos")
        if (resposta.status === 200) {
          const result = await resposta.json()
          setProdutos(result)
        }
        if (resposta.status === 400) {
          const result = await resposta.json()
          setErroMensagem(result.mensagem)
        }
      } catch (erro: any) {
        setErroMensagem("Produto não encontrado")
      }
    }
    fetchData()
  }, [])

  async function trataForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const produtoEditado: ProdutosState = {
      id: parseInt(id),
      nome,
      preco: parseFloat(preco),
      categoria
    }

    try {
      const resposta = await fetch(`http://localhost:8000/produtos/${produtoEditado.id}`, {
        method: modoEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(produtoEditado)
      })

      const result = await resposta.json()

      if (resposta.status === 200) {
        if (modoEdicao) {
          setProdutos(produtos.map(p => p.id === produtoEditado.id ? result : p))
          setModoEdicao(false)
        } else {
          setProdutos([...produtos, result])
        }

        setId("")
        setNome("")
        setPreco("")
        setCategoria("")
      }

      if (resposta.status === 400) {
        setErroMensagem(result.mensagem)
      }

    } catch (erro: any) {
      setErroMensagem("Erro ao salvar produto")
    }
  }

  function iniciarEdicao(produto: ProdutosState) {
    setId(produto.id.toString())
    setNome(produto.nome)
    setPreco(produto.preco.toString())
    setCategoria(produto.categoria)
    setModoEdicao(true)
  }

  function trataId(event: React.ChangeEvent<HTMLInputElement>) {
    console.log("Digitando ID:", event.target.value)
    setId(event.target.value)
  }
  function trataNome(event: React.ChangeEvent<HTMLInputElement>) {
    setNome(event.target.value)
  }
  function trataPreco(event: React.ChangeEvent<HTMLInputElement>) {
    setPreco(event.target.value)
  }
  function trataCategoria(event: React.ChangeEvent<HTMLInputElement>) {
    setCategoria(event.target.value)
  }

  return (
    <>
      {erroMensagem &&
        <div className="mensagem-erro">
          <p>{erroMensagem}</p>
        </div>
      }

      <div className="container">
        <div className="container-cadastro">
          <h1>{modoEdicao ? "Editar Produto" : "Cadastro Produto"}</h1>
          <form onSubmit={trataForm}>
            <input
              type="text"
              name="id"
              id="id"
              placeholder="Id"
              onChange={trataId}
              value={id}
            />
            <input type="text" name="nome" id="nome" placeholder="Nome" onChange={trataNome} value={nome} />
            <input type="text" name="preco" id="preco" placeholder="Preço" onChange={trataPreco} value={preco} />
            <input type="text" name="categoria" id="categoria" placeholder="Categoria" onChange={trataCategoria} value={categoria} />
            <input type="submit" value={modoEdicao ? "Atualizar" : "Cadastrar"} />
          </form>
        </div>

        <div className="container-listagem">
          {produtos.map(produto => {
            return (
              <div key={produto.id} className="container-produto">
                <div className="produto-nome">{produto.nome}</div>
                <div className="produto-preco">{produto.preco}</div>
                <div className="produto-categoria">{produto.categoria}</div>
                <button onClick={() => iniciarEdicao(produto)}>Editar</button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Container