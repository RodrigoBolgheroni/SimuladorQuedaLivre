document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-queda-livre');
  
    form.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const altura = parseFloat(document.getElementById('altura').value);
      const v0 = parseFloat(document.getElementById('velocidade').value);
      const g = parseFloat(document.getElementById('aceleracao').value);
  
      if (isNaN(altura) || isNaN(v0) || isNaN(g)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
      }
  
      const t = (Math.sqrt(v0 * v0 + 2 * g * altura) - v0) / g;
      const vf = v0 + g * t;
  
      const resultadoHTML = `
        <b>Dados do problema:</b><br>
        - Aceleração da gravidade (g): ${g} m/s²<br>
        - Velocidade inicial (v₀): ${v0} m/s<br>
        - Altura inicial (h): ${altura} m<br><br>
        
        <b>Equações do movimento:</b><br>
        - Posição: y = h - (v₀t + ½·g·t²)<br>
        - Velocidade: v = v₀ + g·t<br><br>
  
        <b>Cálculo do tempo total de queda:</b><br>
        - t = ((-v₀ + √(v₀² + 2·g·h)) / g<br>
        - t = ${t.toFixed(2)} segundos<br><br>
  
        <b>Velocidade final:</b><br>
        - v = ${vf.toFixed(2)} m/s<br><br>
  
        <b>Conclusão:</b><br>
        O objeto levará ${t.toFixed(2)} segundos para atingir o solo e chegará com velocidade de ${vf.toFixed(2)} m/s.
      `;
  
      document.querySelector('.calculos-conteudo').innerHTML = resultadoHTML;
    });
  });
  