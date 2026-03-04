document.addEventListener('DOMContentLoaded', () => {
    const receitasContainer = document.getElementById("receitasContainer");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const categorySelect = document.getElementById("categorySelect");

    // Carrega o XML externo
    fetch('receitas.xml')
        .then(res => res.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            renderReceitas(xmlDoc);
            popularCategorias(xmlDoc);
        })
        .catch(err => {
            receitasContainer.innerHTML = '<p>Erro ao carregar as receitas.</p>';
            console.error(err);
        });

    // Popula o select de categorias dinamicamente a partir do XML
    const popularCategorias = (xmlDoc) => {
        const todasReceitas = xmlDoc.querySelectorAll('receita');
        const categorias = new Set();
        todasReceitas.forEach(r => {
            const cat = r.querySelector('categoria')?.textContent.trim();
            if (cat) categorias.add(cat);
        });
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            categorySelect.appendChild(option);
        });
    };

    // Renderiza todas as receitas no container
    const renderReceitas = (xmlDoc) => {
        const todasReceitas = xmlDoc.querySelectorAll('receita');
        let html = '';
        todasReceitas.forEach(receita => {
            html += buildReceitaHTML(receita);
        });
        receitasContainer.innerHTML = html;
    };

    // Monta o HTML de uma receita
    const buildReceitaHTML = (receita) => {
        const id         = receita.getAttribute('id') || '';
        const status     = receita.getAttribute('status') || '';
        const titulo     = receita.querySelector('titulo')?.textContent.trim() || '';
        const categoria  = receita.querySelector('categoria')?.textContent.trim() || '';
        const dific      = receita.querySelector('dificuldade')?.textContent.trim();
        const preparo    = receita.querySelector('tempo_preparo')?.textContent.trim();
        const cozimento  = receita.querySelector('tempo_cozimento')?.textContent.trim();
        const porcoes    = receita.querySelector('porcoes')?.textContent.trim();
        const calorias   = receita.querySelector('calorias_por_porcao')?.textContent.trim();

        // Meta info (só exibe campos que existem)
        let metaHTML = '<div class="meta">';
        if (categoria)  metaHTML += `<span class="tag categoria">${categoria}</span>`;
        if (dific)      metaHTML += `<span class="tag dificuldade">${dific}</span>`;
        if (preparo)    metaHTML += `<span class="tag tempo">⏱ Preparo: ${preparo}</span>`;
        if (cozimento)  metaHTML += `<span class="tag tempo">🔥 Cozimento: ${cozimento}</span>`;
        if (porcoes)    metaHTML += `<span class="tag porcoes">🍽 ${porcoes} porções</span>`;
        if (calorias)   metaHTML += `<span class="tag calorias">~${calorias} kcal/porção</span>`;
        metaHTML += '</div>';

        // Ingredientes agrupados
        let ingredientesHTML = '<div class="ingredientes"><strong>Ingredientes</strong>';
        const grupos = receita.querySelectorAll('grupo');
        grupos.forEach(grupo => {
            const nomeGrupo = grupo.getAttribute('nome');
            // Só mostra o título do grupo se houver mais de um grupo
            if (grupos.length > 1) {
                ingredientesHTML += `<p class="grupo-nome">${nomeGrupo}</p>`;
            }
            ingredientesHTML += '<ul>';
            grupo.querySelectorAll('ingrediente').forEach(ing => {
                ingredientesHTML += `<li>${ing.textContent.trim()}</li>`;
            });
            ingredientesHTML += '</ul>';
        });
        ingredientesHTML += '</div>';

        // Modo de preparo
        const passos = receita.querySelectorAll('passo');
        let modoPrepHTML = '';
        if (passos.length > 0) {
            modoPrepHTML = '<div class="modo-preparo"><strong>Modo de preparo</strong><ol>';
            passos.forEach(passo => {
                const etapa = passo.getAttribute('etapa');
                const label = etapa ? `<span class="etapa-label">${etapa}:</span> ` : '';
                modoPrepHTML += `<li>${label}${passo.textContent.trim()}</li>`;
            });
            modoPrepHTML += '</ol></div>';
        }

        const statusClass = status === 'anotacao' ? ' anotacao' : '';

        return `
            <div class="receita${statusClass}"
                 data-titulo="${titulo.toLowerCase()}"
                 data-categoria="${categoria.toLowerCase()}"
                 id="receita-${id}">
                <div class="titulo">${titulo}${status === 'anotacao' ? ' <span class="badge-anotacao">anotação</span>' : ''}</div>
                ${metaHTML}
                ${ingredientesHTML}
                ${modoPrepHTML}
            </div>
        `;
    };

    // Filtra receitas por categoria e termo de busca
    const filterRecipes = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categorySelect.value;
        document.querySelectorAll('.receita').forEach(receita => {
            const titulo    = receita.getAttribute('data-titulo');
            const categoria = receita.getAttribute('data-categoria');
            const categoryMatch = selectedCategory === 'all' || selectedCategory === categoria;
            const searchMatch   = titulo.includes(searchTerm);
            receita.style.display = (categoryMatch && searchMatch) ? 'block' : 'none';
        });
    };

    searchButton.addEventListener('click', filterRecipes);
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') filterRecipes(); });
    categorySelect.addEventListener('change', filterRecipes);
});
