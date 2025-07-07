import React, { useState } from "react";

interface BotaoExcluirProps {
  id: number;
  onExcluirSucesso: (idExcluido: number) => void;
}

function BotaoExcluir({ id, onExcluirSucesso }: BotaoExcluirProps) {
  const [erro, setErro] = useState("");
                        
  async function excluirProduto() {
    try {
      const resposta = await fetch(`http://localhost:8000/produtos/${id}`, {
        method: "DELETE",
      });

      if (resposta.ok) {
        onExcluirSucesso(id);
      } else {
        const result = await resposta.json();
        setErro(result.mensagem || "Erro ao excluir produto");
      }
    } catch {
      setErro("Erro na conexão ao excluir produto");
    }
  }

  return (
    <div>
      <button onClick={excluirProduto} style={{ backgroundColor: "red", color: "white" }}>
        Excluir
      </button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}

export default BotaoExcluir;