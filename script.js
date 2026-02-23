// DADOS INICIAIS (mock)
let contatos = [
    { id: '1', nome: 'Ana Beatriz', email: 'ana.b@exemplo.com', telefone: '(11) 91234-5678' },
    { id: '2', nome: 'Carlos Eduardo', email: 'carlosedu@exemplo.com', telefone: '(21) 98877-1234' },
    { id: '3', nome: 'Mariana Costa', email: 'mariana.c@exemplo.com', telefone: '(31) 99765-4321' },
    { id: '4', nome: 'João Pedro Lima', email: 'joao.lima@exemplo.com', telefone: '(85) 92345-6789' },
];

// Controle de edição
let editandoId = null;

// Elementos DOM
const filterInput = document.getElementById('filterInput');
const clearFilterBtn = document.getElementById('clearFilterBtn');
const totalCountSpan = document.getElementById('totalCount');
const totalContatosSpan = document.getElementById('totalContatosSpan');
const nomeInput = document.getElementById('nomeInput');
const emailInput = document.getElementById('emailInput');
const telefoneInput = document.getElementById('telefoneInput');
const cadastrarBtn = document.getElementById('cadastrarBtn');
const tableBody = document.getElementById('tableBody');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Utilitário para gerar IDs simples
function gerarId() {
    return Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

// Atualiza todos os totais na interface
function atualizarTotal() {
    const total = contatos.length;
    totalCountSpan.textContent = total;
    totalContatosSpan.textContent = total;
}

// Retorna contatos filtrados
function getContatosFiltrados() {
    const termo = filterInput.value.trim().toLowerCase();
    if (termo === '') return contatos;
    return contatos.filter(c => c.nome.toLowerCase().includes(termo));
}

// Limpa o formulário
function limparFormulario() {
    nomeInput.value = '';
    emailInput.value = '';
    telefoneInput.value = '';
    editandoId = null;
    cadastrarBtn.innerHTML = '<span class="btn-icon">💾</span> Cadastrar';
    cancelEditBtn.style.display = 'none';
}

// Preenche formulário para edição
function preencherFormParaEdicao(contato) {
    nomeInput.value = contato.nome;
    emailInput.value = contato.email;
    telefoneInput.value = contato.telefone;
    editandoId = contato.id;
    cadastrarBtn.innerHTML = '<span class="btn-icon">✏️</span> Alterar contato';
    cancelEditBtn.style.display = 'inline-block';
    nomeInput.focus();
}

// Renderiza a tabela
function renderizarTabela() {
    const filtrados = getContatosFiltrados();
    const termoBusca = filterInput.value.trim().toLowerCase();

    if (filtrados.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="empty-message">📭 Nenhum contato encontrado.</td></tr>';
        atualizarTotal();
        return;
    }

    let html = '';
    filtrados.forEach(contato => {
        let nomeExibicao = contato.nome;
        if (termoBusca !== '' && contato.nome.toLowerCase().includes(termoBusca)) {
            const regex = new RegExp(`(${termoBusca.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            nomeExibicao = contato.nome.replace(regex, '<span class="highlight">$1</span>');
        }

        html += `<tr data-id="${contato.id}">`;
        html += `<td>${nomeExibicao}</td>`;
        html += `<td>${contato.email}</td>`;
        html += `<td>${contato.telefone}</td>`;
        html += `<td style="text-align: center;"><div class="contact-actions">`;
        html += `<button class="btn-icon-action btn-edit" data-id="${contato.id}" title="Editar contato">✏️</button>`;
        html += `<button class="btn-icon-action btn-delete" data-id="${contato.id}" title="Excluir contato">🗑️</button>`;
        html += `</div></td>`;
        html += `</tr>`;
    });
    tableBody.innerHTML = html;
    atualizarTotal();
}

// Salva ou atualiza contato
function salvarOuAtualizar() {
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = telefoneInput.value.trim();

    if (!nome || !email || !telefone) {
        alert('Por favor, preencha todos os campos (nome, e-mail e telefone).');
        return;
    }

    if (editandoId) {
        // EDIÇÃO
        const index = contatos.findIndex(c => c.id === editandoId);
        if (index !== -1) {
            contatos[index] = { 
                ...contatos[index], 
                nome: nome,
                email: email,
                telefone: telefone
            };
        }
        limparFormulario();
    } else {
        // CADASTRO NOVO
        contatos.push({
            id: gerarId(),
            nome: nome,
            email: email,
            telefone: telefone,
        });
        limparFormulario();
    }
    renderizarTabela();
}

// EVENTOS
cadastrarBtn.addEventListener('click', salvarOuAtualizar);

// Enter nos inputs
[nomeInput, emailInput, telefoneInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            salvarOuAtualizar();
        }
    });
});

// Delegação de eventos para botões editar/excluir
tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const row = btn.closest('tr');
    if (!row) return;
    const contatoId = row.getAttribute('data-id');

    // Editar
    if (btn.classList.contains('btn-edit')) {
        e.preventDefault();
        const contato = contatos.find(c => c.id === contatoId);
        if (contato) {
            if (editandoId && editandoId !== contatoId) {
                if (!confirm('Você está editando outro contato. Deseja cancelar a edição anterior e editar este?')) {
                    return;
                }
            }
            preencherFormParaEdicao(contato);
        }
    }

    // Excluir
    if (btn.classList.contains('btn-delete')) {
        e.preventDefault();
        if (confirm('Tem certeza que deseja excluir este contato?')) {
            contatos = contatos.filter(c => c.id !== contatoId);
            if (editandoId === contatoId) {
                limparFormulario();
            }
            renderizarTabela();
        }
    }
});

// Filtro
filterInput.addEventListener('input', renderizarTabela);

// Limpar filtro
clearFilterBtn.addEventListener('click', () => {
    filterInput.value = '';
    renderizarTabela();
    filterInput.focus();
});

// Cancelar edição
cancelEditBtn.addEventListener('click', () => {
    limparFormulario();
    nomeInput.focus();
});

// Inicialização
renderizarTabela();