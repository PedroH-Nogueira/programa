let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
let editIndex = -1;

function calcularTotal(area, servico, manutencao) {
    let precoBase = 10 * area;
    if (servico === "Plantio") precoBase *= 1.2;
    else if (servico === "Manutenção Completa") precoBase *= 1.5;
    if (manutencao === "Sim") precoBase += 100;
    return precoBase;
}

function salvarOrcamento(e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const area = parseFloat(document.getElementById("area").value);
    const servico = document.getElementById("servico").value;
    const manutencao = document.querySelector("input[name='manutencao']:checked").value;

    const total = calcularTotal(area, servico, manutencao);
    const orcamento = { nome, area, servico, manutencao, total };

    if (editIndex >= 0) {
        orcamentos[editIndex] = orcamento;
        editIndex = -1;
    } else {
        orcamentos.push(orcamento);
    }

    localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
    document.getElementById("formulario").reset();
    renderTabela();
}

function renderTabela() {
    const tbody = document.querySelector("#tabela tbody");
    tbody.innerHTML = "";
    orcamentos.forEach((orc, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${orc.nome}</td>
            <td>${orc.servico}</td>
            <td>${orc.area}</td>
            <td>${orc.manutencao}</td>
            <td>R$${orc.total.toFixed(2)}</td>
            <td class="actions">
                <button onclick="editar(${i})">Editar</button>
                <button class="delete" onclick="excluir(${i})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editar(i) {
    const orc = orcamentos[i];
    document.getElementById("nome").value = orc.nome;
    document.getElementById("area").value = orc.area;
    document.getElementById("servico").value = orc.servico;
    document.querySelector(`input[name='manutencao'][value='${orc.manutencao}']`).checked = true;
    editIndex = i;
}

function excluir(i) {
    orcamentos.splice(i, 1);
    localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
    renderTabela();
}

document.getElementById("formulario").addEventListener("submit", salvarOrcamento);
renderTabela();