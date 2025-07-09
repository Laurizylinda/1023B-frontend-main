import { useEffect, useState } from "react"
import './Fornecedor.css'

interface FornecedorState {
  id: number,
  nome: string,
  cnpj: string,
  email: string,
  telefone: string
}

function Fornecedor() {
  const [id, setId] = useState("")
  const [nome, setNome] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [erroMensagem, setErroMensagem] = useState("")
  const [fornecedores, setFornecedores] = useState<FornecedorState[]>([])
  const [modoEdicao, setModoEdicao] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/fornecedores")
        if (resposta.status === 200) {
          const result = await resposta.json()
          setFornecedores(result)
        }
        if (resposta.status === 400) {
          const result = await resposta.json()
          setErroMensagem(result.mensagem)
        }
      } catch (erro: any) {
        setErroMensagem("Fornecedor não encontrado")
      }
    }
    fetchData()
  }, [])

  async function trataForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fornecedorEditado: FornecedorState = {
      id: parseInt(id),
      nome,
      cnpj,
      email,
      telefone
    }

    try {
      const resposta = await fetch(`http://localhost:8000/fornecedores/${fornecedorEditado.id}`, {
        method: modoEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fornecedorEditado)
      })

      const result = await resposta.json()

      if (resposta.status === 200) {
        if (modoEdicao) {
          setFornecedores(fornecedores.map(f => f.id === fornecedorEditado.id ? result : f))
          setModoEdicao(false)
        } else {
          setFornecedores([...fornecedores, result])
        }

        setId("")
        setNome("")
        setCnpj("")
        setEmail("")
        setTelefone("")
      }

      if (resposta.status === 400) {
        setErroMensagem(result.mensagem)
      }

    } catch (erro: any) {
      setErroMensagem("Erro ao salvar fornecedor")
    }
  }

  function iniciarEdicao(fornecedor: FornecedorState) {
    setId(fornecedor.id.toString())
    setNome(fornecedor.nome)
    setCnpj(fornecedor.cnpj)
    setEmail(fornecedor.email)
    setTelefone(fornecedor.telefone)
    setModoEdicao(true)
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
          <h1>{modoEdicao ? "Editar Fornecedor" : "Cadastro Fornecedor"}</h1>
          <form onSubmit={trataForm}>
            <input type="text" placeholder="ID" value={id} onChange={e => setId(e.target.value)} />
            <input type="text" placeholder="Nome da empresa" value={nome} onChange={e => setNome(e.target.value)} />
            <input type="text" placeholder="CNPJ" value={cnpj} onChange={e => setCnpj(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="text" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
            <input type="submit" value={modoEdicao ? "Atualizar" : "Cadastrar"} />
          </form>
        </div>

        <div className="container-listagem">
          {fornecedores.map(fornecedor => {
            return (
              <div key={fornecedor.id} className="container-produto">
                <div className="produto-nome">{fornecedor.nome}</div>
                <div className="produto-preco">{fornecedor.cnpj}</div>
                <div className="produto-categoria">{fornecedor.email} - {fornecedor.telefone}</div>
                <button onClick={() => iniciarEdicao(fornecedor)}>Editar</button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Fornecedor;
