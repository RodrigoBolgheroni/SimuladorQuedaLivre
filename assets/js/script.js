document.addEventListener('DOMContentLoaded', () => {
  const calculosSelect = document.getElementById('calculos');
  const form = document.getElementById('form-queda-livre');
  const resultadoDiv = document.querySelector('.calculos-conteudo');

  const alturaInput = document.getElementById('altura');
  const velocidadeInicialInput = document.getElementById('velocidade-inicial');
  const velocidadeFinalInput = document.getElementById('velocidade-final');
  const tempoInput = document.getElementById('tempo');
  const aceleracaoInput = document.getElementById('aceleracao');

  const allInputs = {
      altura: alturaInput,
      velocidadeInicial: velocidadeInicialInput,
      velocidadeFinal: velocidadeFinalInput,
      tempo: tempoInput,
      aceleracao: aceleracaoInput
  };

  const originalPlaceholders = {};
  for (const key in allInputs) {
      if (allInputs[key]) {
          originalPlaceholders[key] = allInputs[key].placeholder;
      }
  }

  function getUnitForKey(key) {
      switch (key) {
          case 'altura': return 'm';
          case 'velocidadeInicial': return 'm/s';
          case 'velocidadeFinal': return 'm/s';
          case 'tempo': return 's';
          case 'aceleracao': return 'm/s²';
          default: return '';
      }
  }

  function updateInputStates() {
      const selectedValue = calculosSelect.value;

      for (const key in allInputs) {
          if (allInputs[key] && allInputs[key].parentElement) {
              allInputs[key].parentElement.style.display = 'none'; 
              allInputs[key].value = ''; 
              allInputs[key].required = false; 
              allInputs[key].placeholder = originalPlaceholders[key] || ' '; 
              allInputs[key].disabled = false; 
          }
      }

      let targetInputKey = null;
      let inputsToEnableKeys = [];

      switch (selectedValue) {
          case 'altura': // Calcular h = v₀t + 0.5gt²
              targetInputKey = 'altura';
              inputsToEnableKeys = ['velocidadeInicial', 'tempo', 'aceleracao'];
              break;
          case 'velocidadeInicial': // Calcular v₀ = vf - gt
              targetInputKey = 'velocidadeInicial';
              inputsToEnableKeys = ['velocidadeFinal', 'tempo', 'aceleracao'];
              break;
          case 'velocidadeFinal': // Calcular vf = v₀ + gt
              targetInputKey = 'velocidadeFinal';
              inputsToEnableKeys = ['velocidadeInicial', 'tempo', 'aceleracao'];
              break;
          case 'tempo': // Calcular t = (vf - v₀) / g
              targetInputKey = 'tempo';
              inputsToEnableKeys = ['velocidadeInicial', 'velocidadeFinal', 'aceleracao'];
              break;
          case 'gravidade': // Calcular g = (vf - v₀) / t
              targetInputKey = 'aceleracao';
              inputsToEnableKeys = ['velocidadeInicial', 'velocidadeFinal', 'tempo'];
              break;
      }

      inputsToEnableKeys.forEach(key => {
          if (allInputs[key] && allInputs[key].parentElement) {
              allInputs[key].parentElement.style.display = 'block'; 
              allInputs[key].required = true;
              if (key === 'aceleracao') { 
                  allInputs[key].placeholder = "g (m/s²), ex: 9.8";
              }
          }
      });
      
      if (targetInputKey && allInputs[targetInputKey] && allInputs[targetInputKey].parentElement) {
          allInputs[targetInputKey].parentElement.style.display = 'none'; 
      }
  }

  if (calculosSelect) {
    calculosSelect.addEventListener('change', updateInputStates);
  }

  form.addEventListener('submit', function(event) {
      event.preventDefault();
      const selectedCalculation = calculosSelect.value;

      const v0_str = allInputs.velocidadeInicial.disabled ? null : allInputs.velocidadeInicial.value;
      const vf_str = allInputs.velocidadeFinal.disabled ? null : allInputs.velocidadeFinal.value;
      const t_str = allInputs.tempo.disabled ? null : allInputs.tempo.value;
      let g_str = allInputs.aceleracao.disabled ? null : allInputs.aceleracao.value;
      const h_str = allInputs.altura.disabled ? null : allInputs.altura.value;

      let v0 = parseFloat(v0_str);
      let vf = parseFloat(vf_str);
      let t = parseFloat(t_str);
      let g = parseFloat(g_str);
      let h = parseFloat(h_str);


      if (selectedCalculation !== 'gravidade' && !allInputs.aceleracao.disabled && isNaN(g)) {
          g = 9.8;
      }

      let resultadoValor;
      let dadosProblemaStr = "<b>Dados do problema:</b><br>";
      let equacaoStr = "<b>Equação utilizada:</b><br>";
      let calculoPassosStr = "<b>Cálculo:</b><br>";
      let conclusaoStr = "<b>Conclusão:</b><br>";
      let unidade = "";
      let calculoValido = true;


      switch (selectedCalculation) {
          case 'altura': // h = v₀t + 0.5gt²
              if (!isNaN(v0) && !isNaN(t) && !isNaN(g)) {
                  resultadoValor = v0 * t + 0.5 * g * t * t;
                  allInputs.altura.value = resultadoValor.toFixed(2);
                  unidade = "m";
                  dadosProblemaStr += `- Velocidade inicial (v₀): ${v0} m/s<br>`;
                  dadosProblemaStr += `- Tempo (t): ${t} s<br>`;
                  dadosProblemaStr += `- Aceleração (g): ${g} m/s²<br><br>`;
                  equacaoStr += `h = v₀·t + ½·g·t²<br><br>`;
                  calculoPassosStr += `h = (${v0}) · (${t}) + ½ · (${g}) · (${t}²)<br>`;
                  calculoPassosStr += `h = ${v0 * t} + ${0.5 * g * t * t}<br>`;
                  calculoPassosStr += `h = ${resultadoValor.toFixed(2)} ${unidade}<br><br>`;
                  conclusaoStr += `A altura calculada é ${resultadoValor.toFixed(2)} ${unidade}.`;
              } else {
                  calculoValido = false;
              }
              break;

          case 'velocidadeInicial': // v₀ = vf - gt
              if (!isNaN(vf) && !isNaN(t) && !isNaN(g)) {
                  resultadoValor = vf - g * t;
                  allInputs.velocidadeInicial.value = resultadoValor.toFixed(2);
                  unidade = "m/s";
                  dadosProblemaStr += `- Velocidade final (vf): ${vf} m/s<br>`;
                  dadosProblemaStr += `- Tempo (t): ${t} s<br>`;
                  dadosProblemaStr += `- Aceleração (g): ${g} m/s²<br><br>`;
                  equacaoStr += `v₀ = vf - g·t<br><br>`;
                  calculoPassosStr += `v₀ = (${vf}) - (${g}) · (${t})<br>`;
                  calculoPassosStr += `v₀ = ${vf} - ${g * t}<br>`;
                  calculoPassosStr += `v₀ = ${resultadoValor.toFixed(2)} ${unidade}<br><br>`;
                  conclusaoStr += `A velocidade inicial calculada é ${resultadoValor.toFixed(2)} ${unidade}.`;
              } else {
                  calculoValido = false;
              }
              break;

          case 'velocidadeFinal': // vf = v₀ + gt
              if (!isNaN(v0) && !isNaN(t) && !isNaN(g)) {
                  resultadoValor = v0 + g * t;
                  allInputs.velocidadeFinal.value = resultadoValor.toFixed(2);
                  unidade = "m/s";
                  dadosProblemaStr += `- Velocidade inicial (v₀): ${v0} m/s<br>`;
                  dadosProblemaStr += `- Tempo (t): ${t} s<br>`;
                  dadosProblemaStr += `- Aceleração (g): ${g} m/s²<br><br>`;
                  equacaoStr += `vf = v₀ + g·t<br><br>`;
                  calculoPassosStr += `vf = (${v0}) + (${g}) · (${t})<br>`;
                  calculoPassosStr += `vf = ${v0} + ${g * t}<br>`;
                  calculoPassosStr += `vf = ${resultadoValor.toFixed(2)} ${unidade}<br><br>`;
                  conclusaoStr += `A velocidade final calculada é ${resultadoValor.toFixed(2)} ${unidade}.`;
              } else {
                  calculoValido = false;
              }
              break;

          case 'tempo': // t = (vf - v₀) / g
              if (!isNaN(v0) && !isNaN(vf) && !isNaN(g)) {
                  if (g === 0) {
                      conclusaoStr = "A aceleração (g) não pode ser zero para este cálculo, a menos que v₀ = vf (tempo indeterminado).";
                      calculoValido = false;
                      resultadoValor = NaN; 
                  } else {
                      resultadoValor = (vf - v0) / g;
                      if (resultadoValor < 0) {
                          conclusaoStr = `O tempo calculado é ${resultadoValor.toFixed(2)} s. Um tempo negativo pode indicar que o estado final (vf) não é alcançável a partir do inicial (v0) com a aceleração 'g' na direção assumida, ou já foi ultrapassado.`;
                      } else {
                          conclusaoStr = `O tempo calculado é ${resultadoValor.toFixed(2)} s.`;
                      }
                      allInputs.tempo.value = resultadoValor.toFixed(2);
                      unidade = "s";
                      dadosProblemaStr += `- Velocidade inicial (v₀): ${v0} m/s<br>`;
                      dadosProblemaStr += `- Velocidade final (vf): ${vf} m/s<br>`;
                      dadosProblemaStr += `- Aceleração (g): ${g} m/s²<br><br>`;
                      equacaoStr += `t = (vf - v₀) / g<br><br>`;
                      calculoPassosStr += `t = ((${vf}) - (${v0})) / (${g})<br>`;
                      calculoPassosStr += `t = ${vf - v0} / ${g}<br>`;
                      calculoPassosStr += `t = ${resultadoValor.toFixed(2)} ${unidade}<br><br>`;
                  }
              } else {
                  calculoValido = false;
              }
              break;

          case 'gravidade': // g = (vf - v₀) / t
              if (!isNaN(v0) && !isNaN(vf) && !isNaN(t)) {
                  if (t === 0) {
                      conclusaoStr = "O tempo (t) não pode ser zero para este cálculo, a menos que v₀ = vf (aceleração indeterminada).";
                      calculoValido = false;
                      resultadoValor = NaN; 
                  } else {
                      resultadoValor = (vf - v0) / t;
                      allInputs.aceleracao.value = resultadoValor.toFixed(2);
                      unidade = "m/s²";
                      dadosProblemaStr += `- Velocidade inicial (v₀): ${v0} m/s<br>`;
                      dadosProblemaStr += `- Velocidade final (vf): ${vf} m/s<br>`;
                      dadosProblemaStr += `- Tempo (t): ${t} s<br><br>`;
                      equacaoStr += `g = (vf - v₀) / t<br><br>`;
                      calculoPassosStr += `g = ((${vf}) - (${v0})) / (${t})<br>`;
                      calculoPassosStr += `g = ${vf - v0} / ${t}<br>`;
                      calculoPassosStr += `g = ${resultadoValor.toFixed(2)} ${unidade}<br><br>`;
                      conclusaoStr += `A aceleração calculada é ${resultadoValor.toFixed(2)} ${unidade}.`;
                  }
              } else {
                  calculoValido = false;
              }
              break;
          default:
              resultadoDiv.innerHTML = "<p>Selecione um tipo de cálculo no menu 'Parâmetros'.</p>";
              return;
      }

      if (!calculoValido && isNaN(resultadoValor)) { 
           resultadoDiv.innerHTML = "<p>Por favor, preencha os campos necessários com valores numéricos válidos para realizar o cálculo.</p>";
      } else if (!calculoValido && !isNaN(resultadoValor)) { 
           resultadoDiv.innerHTML = `<p>${conclusaoStr}</p>`; 
      } else if (calculoValido) {
          resultadoDiv.innerHTML = dadosProblemaStr + equacaoStr + calculoPassosStr + conclusaoStr;
      } else {
          resultadoDiv.innerHTML = "<p>Não foi possível realizar o cálculo. Verifique os valores inseridos.</p>";
      }
  });

  updateInputStates();
});
