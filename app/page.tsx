"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shuffle, Download, Upload } from "lucide-react"

// Dados dos blocos e suas vagas
const blocosData = {
  "Bloco 1A": [2, 3, 4, 480, 479, 478, 477, 476, 475, 474, 71, 280, 283, 284, 285, 286, 287, 281, 280, 279],
  "Bloco 1B": [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70],
  "Bloco 2A": [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 54, 55, 56, 57, 58, 59, 60],
  "Bloco 2B": [37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  "Bloco 3A": [72, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 106, 105, 104, 103],
  "Bloco 3B": [48, 49, 50, 51, 52, 53, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73],
  "Bloco 4A": [166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185],
  "Bloco 4B": [154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 113, 112, 111, 110, 109, 108, 107, 102],
  "Bloco 5A": [123, 122, 121, 120, 119, 118, 117, 116, 115, 114, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153],
  "Bloco 5B": [133, 132, 131, 130, 129, 128, 127, 126, 125, 124, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143],
  "Bloco 6A": [186, 187, 188, 189, 190, 191, 192, 193, 194, 257, 256, 255, 254, 253, 252, 258, 259, 278, 277, 276],
  "Bloco 6B": [195, 196, 197, 198, 199, 200, 201, 288, 289, 290, 291, 292, 293, 294, 275, 274, 273, 272, 271, 270],
  "Bloco 7A": [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 251, 250, 249, 248, 247, 246, 245, 244, 243, 242],
  "Bloco 7B": [212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 231, 230, 229, 228, 227, 226, 225, 224, 223, 222],
  "Bloco 8A": [353, 354, 352, 351, 350, 349, 348, 347, 346, 345, 344, 343, 342, 341, 340, 295, 296, 297, 298, 299],
  "Bloco 8B": [260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 241, 240, 239, 238, 237, 236, 235, 234, 233, 232],
  "Bloco 8C": [310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329],
  "Bloco 9A": [371, 372, 373, 374, 370, 369, 368, 367, 366, 365, 364, 363, 362, 355, 356, 357, 358, 359, 360, 361],
  "Bloco 9B": [339, 338, 337, 336, 335, 334, 333, 332, 331, 330, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309],
  "Bloco 9C": [375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394],
  "Bloco 10A": [442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461],
  "Bloco 10B": [473, 472, 471, 470, 469, 468, 467, 466, 465, 464, 463, 441, 440, 439, 438, 437, 436, 435, 434, 462],
  "Bloco 11A": [433, 432, 431, 430, 429, 428, 427, 426, 425, 424, 423, 422, 421, 420, 419, 418, 395, 396, 397, 398],
  "Bloco 11B": [417, 416, 415, 414, 413, 412, 411, 410, 409, 408, 407, 406, 399, 400, 401, 402, 403, 404, 405, 481],
}

// Vagas PCD
const vagasPCD = [30, 29, 133, 132, 147, 148, 204, 205, 230, 229, 306, 307, 387, 388, 406, 441]

// Unidades padrão para todos os blocos
const unidades = [
  "01",
  "02",
  "03",
  "04",
  "11",
  "12",
  "13",
  "14",
  "21",
  "22",
  "23",
  "24",
  "31",
  "32",
  "33",
  "34",
  "41",
  "42",
  "43",
  "44",
]

interface SorteioResult {
  bloco: string
  unidade: string
  vaga: number
}

export default function SorteioVagas() {
  const [resultadoSorteio, setResultadoSorteio] = useState<SorteioResult[]>([])
  const [sorteioRealizado, setSorteioRealizado] = useState(false)
  const [dataHoraSorteio, setDataHoraSorteio] = useState<string>("")
  const [editandoItem, setEditandoItem] = useState<string | null>(null)
  const [novaVaga, setNovaVaga] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Realizar sorteio inicial ao carregar a página
  useEffect(() => {
    realizarSorteioGeral()
  }, [])

  const realizarSorteioGeral = () => {
    const resultado: SorteioResult[] = []

    Object.entries(blocosData).forEach(([nomeBloco, vagasDisponiveis]) => {
      const vagasEmbaralhadas = [...vagasDisponiveis]

      for (let i = vagasEmbaralhadas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[vagasEmbaralhadas[i], vagasEmbaralhadas[j]] = [vagasEmbaralhadas[j], vagasEmbaralhadas[i]]
      }

      unidades.forEach((unidade, index) => {
        resultado.push({
          bloco: nomeBloco,
          unidade,
          vaga: vagasEmbaralhadas[index],
        })
      })
    })

    resultado.sort((a, b) => {
      const extrairBlocoInfo = (bloco: string) => {
        const match = bloco.match(/Bloco (\d+)([A-C])/)
        if (match) {
          return [Number.parseInt(match[1]), match[2]]
        }
        return [0, "A"]
      }

      const [numA, letraA] = extrairBlocoInfo(a.bloco)
      const [numB, letraB] = extrairBlocoInfo(b.bloco)

      if (numA !== numB) return numA - numB
      if (letraA !== letraB) return letraA.localeCompare(letraB)
      return Number.parseInt(a.unidade) - Number.parseInt(b.unidade)
    })

    setResultadoSorteio(resultado)
    setSorteioRealizado(true)
    setDataHoraSorteio(new Date().toLocaleString("pt-BR"))
  }

  const iniciarEdicao = (bloco: string, unidade: string, vagaAtual: number) => {
    const chave = `${bloco}-${unidade}`
    setEditandoItem(chave)
    setNovaVaga(vagaAtual.toString())
  }

  const confirmarEdicao = (bloco: string, unidade: string) => {
    const novaVagaNum = Number.parseInt(novaVaga)
    if (isNaN(novaVagaNum)) {
      setEditandoItem(null)
      setNovaVaga("")
      return
    }

    // Encontrar o item atual
    const itemAtualIndex = resultadoSorteio.findIndex((item) => item.bloco === bloco && item.unidade === unidade)

    if (itemAtualIndex === -1) {
      setEditandoItem(null)
      setNovaVaga("")
      return
    }

    const vagaAtual = resultadoSorteio[itemAtualIndex].vaga

    // Se a nova vaga é igual à atual, não faz nada
    if (novaVagaNum === vagaAtual) {
      setEditandoItem(null)
      setNovaVaga("")
      return
    }

    // Encontrar quem tem a nova vaga
    const itemComNovaVagaIndex = resultadoSorteio.findIndex((item) => item.vaga === novaVagaNum)

    const novoResultado = [...resultadoSorteio]

    if (itemComNovaVagaIndex !== -1) {
      // Trocar as vagas
      novoResultado[itemAtualIndex].vaga = novaVagaNum
      novoResultado[itemComNovaVagaIndex].vaga = vagaAtual
    } else {
      // Apenas alterar a vaga atual
      novoResultado[itemAtualIndex].vaga = novaVagaNum
    }

    setResultadoSorteio(novoResultado)
    setEditandoItem(null)
    setNovaVaga("")
  }

  const importarArquivo = () => {
    fileInputRef.current?.click()
  }

  const processarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const conteudo = e.target?.result as string
        const linhas = conteudo.split("\n")

        const resultado: SorteioResult[] = []
        let blocoAtual = ""
        let dataHoraImportada = ""

        for (const linha of linhas) {
          const linhaTrimmed = linha.trim()

          // Capturar data e hora
          if (linhaTrimmed.startsWith("Data e Hora:")) {
            dataHoraImportada = linhaTrimmed.replace("Data e Hora:", "").trim()
            continue
          }

          // Identificar bloco
          if (linhaTrimmed.startsWith("Bloco ") && linhaTrimmed.endsWith(":")) {
            blocoAtual = linhaTrimmed.replace(":", "")
            continue
          }

          // Processar linha de unidade → vaga
          const match = linhaTrimmed.match(/Unidade (\d+) → Vaga (\d+)/)
          if (match && blocoAtual) {
            const unidade = match[1]
            const vaga = Number.parseInt(match[2])

            resultado.push({
              bloco: blocoAtual,
              unidade,
              vaga,
            })
          }
        }

        if (resultado.length > 0) {
          // Ordenar resultado
          resultado.sort((a, b) => {
            const extrairBlocoInfo = (bloco: string) => {
              const match = bloco.match(/Bloco (\d+)([A-C])/)
              if (match) {
                return [Number.parseInt(match[1]), match[2]]
              }
              return [0, "A"]
            }

            const [numA, letraA] = extrairBlocoInfo(a.bloco)
            const [numB, letraB] = extrairBlocoInfo(b.bloco)

            if (numA !== numB) return numA - numB
            if (letraA !== letraB) return letraA.localeCompare(letraB)
            return Number.parseInt(a.unidade) - Number.parseInt(b.unidade)
          })

          setResultadoSorteio(resultado)
          setSorteioRealizado(true)
          setDataHoraSorteio(dataHoraImportada || new Date().toLocaleString("pt-BR"))

          alert(`Arquivo importado com sucesso! ${resultado.length} vagas carregadas.`)
        } else {
          alert("Não foi possível processar o arquivo. Verifique o formato.")
        }
      } catch (error) {
        alert("Erro ao processar o arquivo. Verifique se é um arquivo válido.")
      }
    }

    reader.readAsText(file, "utf-8")

    // Limpar o input para permitir reimportar o mesmo arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const exportarResultado = () => {
    if (resultadoSorteio.length === 0) return

    let conteudo = `SORTEIO GERAL DE VAGAS - CONDOMÍNIO\n`
    conteudo += `Data e Hora: ${dataHoraSorteio}\n`
    conteudo += `${"=".repeat(50)}\n\n`

    const resultadoPorBloco = resultadoSorteio.reduce(
      (acc, item) => {
        if (!acc[item.bloco]) acc[item.bloco] = []
        acc[item.bloco].push(item)
        return acc
      },
      {} as Record<string, SorteioResult[]>,
    )

    Object.entries(resultadoPorBloco).forEach(([bloco, items]) => {
      conteudo += `${bloco}:\n`
      conteudo += `${"-".repeat(20)}\n`
      items.forEach((item) => {
        const isPCD = vagasPCD.includes(item.vaga)
        conteudo += `Unidade ${item.unidade} → Vaga ${item.vaga}${isPCD ? " (PCD)" : ""}\n`
      })
      conteudo += `\n`
    })

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sorteio-geral-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resultadoPorBloco = resultadoSorteio.reduce(
    (acc, item) => {
      if (!acc[item.bloco]) acc[item.bloco] = []
      acc[item.bloco].push(item)
      return acc
    },
    {} as Record<string, SorteioResult[]>,
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Sorteio de Vagas</h1>
          <p className="text-zinc-400">Sistema de distribuição aleatória para condomínio</p>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4 mb-12">
          <Button onClick={realizarSorteioGeral} size="lg" className="bg-white text-black hover:bg-zinc-200">
            <Shuffle className="w-4 h-4 mr-2" />
            Novo Sorteio
          </Button>

          <Button
            onClick={importarArquivo}
            variant="outline"
            size="lg"
            className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>

          {sorteioRealizado && (
            <Button
              onClick={exportarResultado}
              variant="outline"
              size="lg"
              className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          )}

          {sorteioRealizado && <div className="text-zinc-400 text-sm ml-4">Sorteio realizado em {dataHoraSorteio}</div>}
        </div>

        {/* Input oculto para arquivo */}
        <input ref={fileInputRef} type="file" accept=".txt" onChange={processarArquivo} style={{ display: "none" }} />

        {/* Resultados */}
        {sorteioRealizado && (
          <div className="space-y-8">
            {Object.entries(resultadoPorBloco).map(([bloco, items]) => (
              <div key={bloco}>
                <h2 className="text-xl font-semibold mb-4">{bloco}</h2>
                <div className="grid grid-cols-10 gap-2">
                  {items.map((item, index) => {
                    const chaveItem = `${item.bloco}-${item.unidade}`
                    const estaEditando = editandoItem === chaveItem
                    const isPCD = vagasPCD.includes(item.vaga)

                    return (
                      <div
                        key={index}
                        className={`border rounded p-3 text-center hover:bg-zinc-800 transition-colors cursor-pointer ${
                          isPCD ? "bg-blue-900 border-blue-600" : "bg-zinc-900 border-zinc-800"
                        }`}
                      >
                        <div className="text-sm text-zinc-400 mb-1">Apt {item.unidade}</div>

                        {estaEditando ? (
                          <Input
                            value={novaVaga}
                            onChange={(e) => setNovaVaga(e.target.value)}
                            className="h-6 text-sm bg-zinc-800 border-zinc-700 text-center"
                            autoFocus
                            onBlur={() => confirmarEdicao(item.bloco, item.unidade)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                confirmarEdicao(item.bloco, item.unidade)
                              } else if (e.key === "Escape") {
                                setEditandoItem(null)
                                setNovaVaga("")
                              }
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center h-8">
                            <div
                              className="text-base font-medium"
                              onClick={() => iniciarEdicao(item.bloco, item.unidade, item.vaga)}
                            >
                              {item.vaga}
                            </div>
                            <div className="text-xs mt-1 h-4 flex items-center">
                              {isPCD ? <span className="text-blue-300">PCD</span> : <span>&nbsp;</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {sorteioRealizado && (
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <div className="grid grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold">{resultadoSorteio.length}</div>
                <div className="text-zinc-400 text-sm">Vagas Sorteadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{Object.keys(resultadoPorBloco).length}</div>
                <div className="text-zinc-400 text-sm">Blocos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {resultadoSorteio.filter((item) => vagasPCD.includes(item.vaga)).length}
                </div>
                <div className="text-zinc-400 text-sm">Vagas PCD</div>
              </div>
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-zinc-400 text-sm">Concluído</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
