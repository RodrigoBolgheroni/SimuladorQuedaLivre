document.addEventListener('DOMContentLoaded', () => {
    const maca = document.getElementById('maca');
    const arvoreImg = document.getElementById('img-simulacao'); 
    const simulacaoContainer = arvoreImg ? arvoreImg.parentElement : null; 
    const btnVerSimulacao = document.getElementById('btn-ver-simulacao');

    const alturaInput = document.getElementById('altura');
    const velocidadeInicialInput = document.getElementById('velocidade-inicial');
    const aceleracaoInput = document.getElementById('aceleracao');

    let animationFrameId = null;

    if (!maca || !arvoreImg || !simulacaoContainer) {
        console.error("Elementos essenciais da simulação (maçã, imagem da árvore ou container) não foram encontrados.");
        if (btnVerSimulacao) btnVerSimulacao.disabled = true;
        return;
    }


    function iniciarSimulacao(h_metros, v0_mps, g_mps2) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        const containerHeightPx = arvoreImg.clientHeight - 80;
        if (containerHeightPx <= 0) {
            alert("A altura do container da simulação não pôde ser determinada. Verifique o CSS.");
            return;
        }

        const escalaMetrosParaPixels = h_metros > 0 ? containerHeightPx / h_metros : 0;

        if (escalaMetrosParaPixels === 0 && h_metros > 0) {
             alert("Não foi possível calcular a escala para a simulação. Verifique a altura fornecida e a altura do container.");
             return;
        }



        let tempoDecorridoSegundos = 0;
        const tempoSimulacaoInicioMs = performance.now();

        function animar(currentTimeMs) {
            tempoDecorridoSegundos = (currentTimeMs - tempoSimulacaoInicioMs) / 1000;

            let deslocamentoMetros = (v0_mps * tempoDecorridoSegundos) + (0.5 * g_mps2 * Math.pow(tempoDecorridoSegundos, 2));

            let posicaoAtualPx = deslocamentoMetros * escalaMetrosParaPixels;

            if (deslocamentoMetros >= h_metros || posicaoAtualPx >= containerHeightPx) {
                posicaoAtualPx = containerHeightPx; 
                maca.style.top = posicaoAtualPx - maca.offsetHeight + 'px'; 
                if (maca.offsetHeight === 0) { 
                    maca.style.top = posicaoAtualPx + 'px';
                }
                console.log(`Simulação concluída. Tempo: ${tempoDecorridoSegundos.toFixed(2)}s, Deslocamento: ${h_metros.toFixed(2)}m`);
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                return;
            }

            maca.style.top = posicaoAtualPx + 'px';
            animationFrameId = requestAnimationFrame(animar);
        }
        animationFrameId = requestAnimationFrame(animar);
    }

    if (btnVerSimulacao) {
        btnVerSimulacao.addEventListener('click', () => {
            let h_val = parseFloat(alturaInput.value);
            let v0_val = parseFloat(velocidadeInicialInput.value);
            let g_val = parseFloat(aceleracaoInput.value);


            const h = !isNaN(h_val) && h_val > 0 ? h_val : null;
            const v0 = !isNaN(v0_val) && h_val >= 0 ? v0_val : null; 
            const g = !isNaN(g_val) && g_val > 0 ? g_val : 9.8; 

            if (h === null) {
                alert("Por favor, insira uma 'Altura inicial (m)' válida e maior que zero para a simulação.");
                return;
            }
            if (v0 === null) {
                alert("Por favor, insira uma velocidade maior ou igual a 0 para a simulação.");
                return;
            }
            if (g <= 0) {
                alert("A 'Aceleração da Gravidade (m/s²)' deve ser maior que zero.");
                return;
            }

            console.log(`Iniciando simulação com: Altura=${h}m, Vel. Inicial=${v0}m/s, Gravidade=${g}m/s²`);
            iniciarSimulacao(h, v0, g);
        });
    } else {
        console.error("Botão 'Ver simulação' (btn-ver-simulacao) não encontrado.");
    }
});
